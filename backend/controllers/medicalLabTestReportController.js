const MedicalLabTestReport = require('../models/MedicalLabTestReport');

// Create a new medical lab test report
async function createReport(req, res) {
    try {
        const report = new MedicalLabTestReport(req.body);
        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all medical lab test reports
async function getAllReports(req, res) {
    try {
        const reports = await MedicalLabTestReport.find();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a medical lab test report by ID
async function getReportById(req, res) {
    try {
        const report = await MedicalLabTestReport.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a medical lab test report by ID
async function updateReport(req, res) {
    try {
        const report = await MedicalLabTestReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.status(200).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a medical lab test report by ID
async function deleteReport(req, res) {
    try {
        const report = await MedicalLabTestReport.findByIdAndDelete(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Export the controller functions
module.exports = {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport
}; 