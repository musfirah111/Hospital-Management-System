const express = require('express');
const router = express.Router();
const {
    createReport,
    getReportById,
    searchReportsByPatientId,
    searchReportsByName,
    downloadReport,
    shareReport,
    getDailyLabReports,
    getWeeklyLabReports,
    getMonthlyLabReports
} = require('../controllers/medicalLabTestReportController');
const { protect } = require('../middlewares/authMiddleware');
const { doctorOnly } = require('../middlewares/roleMiddleware');

router.get('/daily-registrations', protect, getDailyLabReports);
router.get('/weekly-registrations', protect,  getWeeklyLabReports);
router.get('/monthly-registrations', protect,  getMonthlyLabReports);
router.post('/', protect, doctorOnly, createReport);
router.get('/:id', protect, getReportById);
router.get('/patient/:patientId', protect, searchReportsByPatientId);
router.get('/search', protect, searchReportsByName);
router.get('/download/:id', protect, downloadReport);
router.post('/share/:id', protect, shareReport);

module.exports = router; 