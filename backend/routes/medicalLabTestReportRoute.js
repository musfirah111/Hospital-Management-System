const express = require('express');
const router = express.Router();
const {
    createReport,
    getReportById,
    searchReportsByPatientId,
    searchReportsByName,
    downloadReport,
    shareReport,
} = require('../controllers/medicalRecord');
const { protect } = require('../middlewares/authMiddleware');
const { doctorOnly } = require('../middlewares/roleMiddleware');

// Route to create a new medical lab test report (Doctor)
router.post('/reports', protect, doctorOnly, createReport);

// Route to view a medical lab test report by ID (Patient/Doctor)
router.get('/reports/:id', protect, getReportById);

// Route to search reports based on patient ID
router.get('/reports/patient/:patientId', protect, searchReportsByPatientId);

// Route to search reports by name and sort by date
router.get('/reports/search', protect, searchReportsByName);

// Route to download report results
router.get('/reports/download/:id', protect, downloadReport);

// Route to share report results
router.post('/reports/share/:id', protect, shareReport);

module.exports = router; 