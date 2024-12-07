const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const transporter = require('../config/emailConfig');
const MedicalLabTestReport = require('../models/MedicalLabTestReport');
const Patient = require('../models/Patient');

// Create a new medical lab test report (Doctor)
const createReport = asyncHandler(async (req, res) => {
    try {
        const report = new MedicalLabTestReport(req.body);
        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// View a medical lab test report by ID (Patient/Doctor)
const getReportById = asyncHandler(async (req, res) => {
    try {
        const report = await MedicalLabTestReport.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search reports based on patient ID
const searchReportsByPatientId = asyncHandler(async (req, res) => {
    try {
        const reports = await MedicalLabTestReport.find({ patient_id: req.params.patientId });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search reports by name and sort by date
const searchReportsByName = asyncHandler(async (req, res) => {
    try {
        const { name } = req.query;
        const reports = await MedicalLabTestReport.find({
            $or: [
                { test_name: { $regex: name, $options: 'i' } },
                { 'doctor_id.user_id.name': { $regex: name, $options: 'i' } }
            ]
        })
        .populate({
            path: 'doctor_id',
            populate: { 
                path: 'user_id',
                select: 'name'
            }
        })
        .sort({ test_date: -1 });

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Download report results as PDF
const downloadReport = asyncHandler(async (req, res) => {
    try {
        const report = await MedicalLabTestReport.findById(req.params.id)
            .populate({
                path: 'patient_id',
                populate: {
                    path: 'user_id',
                    select: 'name'
                }
            })
            .populate({
                path: 'doctor_id',
                populate: { 
                    path: 'user_id',
                    select: 'name'
                }
            });
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Create a PDF document
        const doc = new PDFDocument();
        const filename = `report_${report._id}.pdf`;

        // Force download headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-Transfer-Encoding', 'binary');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', 0);

        // Pipe the PDF into the response
        doc.pipe(res);

        // Add content to the PDF with proper spacing
        doc.fontSize(25)
            .text('Medical Lab Test Report', { align: 'center' })
            .moveDown();

        doc.fontSize(12)
            .text(`Patient Name: ${report.patient_id.user_id.name}`)
            .moveDown()
            .text(`Doctor Name: ${report.doctor_id.user_id.name}`)
            .moveDown()
            .text(`Test Name: ${report.test_name}`)
            .moveDown()
            .text(`Results: ${report.result}`)
            .moveDown()
            .text(`Date: ${report.test_date}`)
            .moveDown()
            .text(`Comments: ${report.comments || 'N/A'}`);

        // End the document
        doc.end();

    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
});

const shareReport = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { email } = req.body;
  
      // Fetch the report details
      const report = await MedicalLabTestReport.findById(id);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      // Check if the authenticated user owns the report
      if (report.patient_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to share this report' });
      }
  
      // Fetch the patient details
      const patient = await Patient.findById(report.patient_id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      // Ensure the patient has email credentials
      if (!patient.email || !patient.emailPassword) {
        return res.status(400).json({ message: 'Patient email credentials are missing' });
      }
  
      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Ensure the email provider matches the patient's email
        auth: {
          user: patient.email,
          pass: patient.emailPassword,
        },
      });
  
      // Send the email
      const mailOptions = {
        from: patient.email,
        to: email,
        subject: 'Medical Lab Test Report Shared',
        html: `
          <h1>Medical Lab Test Report Details</h1>
          <p><strong>Test Name:</strong> ${report.test_name}</p>
          <p><strong>Test Date:</strong> ${report.test_date}</p>
          <p><strong>Result:</strong> ${report.result}</p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Report shared successfully' });
    } catch (error) {
      console.error('Error sharing report:', error);
      res.status(500).json({ message: `Error sharing report: ${error.message}` });
    }
  });
  

const getDailyLabReports = asyncHandler(async (req, res) => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Subtract 24 hours

    const dailyCount = await MedicalLabTestReport.countDocuments({
        test_date: { $gte: last24Hours },
    });

    res.json({ dailyCount });
});

const getWeeklyLabReports = asyncHandler(async (req, res) => {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Subtract 7 days

    const weeklyCount = await MedicalLabTestReport.countDocuments({
        test_date: { $gte: last7Days },
    });

    res.json({ weeklyCount });
});

const getMonthlyLabReports = asyncHandler(async (req, res) => {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Subtract 30 days

    const monthlyCount = await MedicalLabTestReport.countDocuments({
        test_date: { $gte: last30Days },
    });

    res.json({ monthlyCount });
});

const getLabReportsByPatientId = asyncHandler(async (req, res) => {
    try {
        console.log('Received request for patient ID:', req.params.patientId);
        const reports = await MedicalLabTestReport.find({ patient_id: req.params.patientId })
            .populate({
                path: 'doctor_id',
                populate: { 
                    path: 'user_id',
                    select: 'name' 
                }
            });
        
        console.log('Found reports:', reports);
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error in getLabReportsByPatientId:', error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = {
    createReport,
    getReportById,
    searchReportsByPatientId,
    searchReportsByName,
    downloadReport,
    shareReport,
    getDailyLabReports,
    getWeeklyLabReports,
    getMonthlyLabReports,
    getLabReportsByPatientId
};