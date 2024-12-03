const express = require('express');
const router = express.Router();
const {
    createReport,
    getReportById,
    searchReportsByPatientId,
    searchReportsByName,
    downloadReport,
    shareReport,
} = require('../controllers/medicalLabTestReportController');
const { protect } = require('../middlewares/authMiddleware');
const { doctorOnly } = require('../middlewares/roleMiddleware');

router.post('/', protect, doctorOnly, createReport);
router.get('/:id', protect, getReportById);
router.get('/patient/:patientId', protect, searchReportsByPatientId);
router.get('/search', protect, searchReportsByName);
router.get('/download/:id', protect, downloadReport);
router.post('/share/:id', protect, shareReport);

module.exports = router; 