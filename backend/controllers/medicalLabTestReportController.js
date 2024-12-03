const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const MedicalLabTestReport = require('../models/MedicalLabTestReport');

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
        const reports = await MedicalLabTestReport.find({ name: req.query.name }).sort({ date: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Download report results as PDF
const downloadReport = asyncHandler(async (req, res) => {
    const report = await MedicalLabTestReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Create a PDF document
    const doc = new PDFDocument();
    let filename = `report_${report._id}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    // Add content to the PDF
    doc.fontSize(25).text('Medical Lab Test Report', { align: 'center' });
    doc.text(`Patient ID: ${report.patient_id}`);
    doc.text(`Doctor ID: ${report.doctor_id}`);
    doc.text(`Test Name: ${report.test_name}`);
    doc.text(`Results: ${report.results}`);
    doc.text(`Date: ${report.date}`);
    doc.text(`Comments: ${report.comments || 'N/A'}`);

    // Finalize the PDF and end the response
    doc.pipe(res);
    doc.end();
});

// Share report results via email
const shareReport = asyncHandler(async (req, res) => {
    const report = await MedicalLabTestReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const { email } = req.body; // Expecting the email address in the request body

    // Create a PDF document for the email attachment
    const doc = new PDFDocument();
    let filename = `report_${report._id}.pdf`;
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service
            auth: {
                user: req.user.email, //Email of the user
                pass: req.user.password, //Password of the user
            },
        });

        // Email options
        const mailOptions = {
            from: req.user.email,
            to: email,
            subject: 'Your Medical Lab Test Report',
            text: 'Please find attached your medical lab test report.',
            attachments: [
                {
                    filename: filename,
                    content: pdfData,
                },
            ],
        };

        // Send the email
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Report shared successfully via email.' });
        } catch (error) {
            res.status(500).json({ message: 'Error sending email: ' + error.message });
        }
    });

    // Add content to the PDF
    doc.fontSize(25).text('Medical Lab Test Report', { align: 'center' });
    doc.text(`Patient ID: ${report.patient_id}`);
    doc.text(`Doctor ID: ${report.doctor_id}`);
    doc.text(`Test Name: ${report.test_name}`);
    doc.text(`Results: ${report.results}`);
    doc.text(`Date: ${report.date}`);
    doc.text(`Comments: ${report.comments || 'N/A'}`);

    // Finalize the PDF
    doc.end();
});

module.exports = {
    createReport,
    getReportById,
    searchReportsByPatientId,
    searchReportsByName,
    downloadReport,
    shareReport,
};