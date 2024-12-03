const express = require('express');
const router = express.Router();
const {
    createRecord,
    getRecordById,
    searchRecordsByPatientId,
    searchRecordsByName,
} = require('../controllers/medicalRecordController');
const { protect } = require('../middlewares/authMiddleware');
const { doctorOnly } = require('../middlewares/roleMiddleware');

// Route to create a new medical record (Doctor)
router.post('/records', protect, doctorOnly, createRecord);

// Route to view a medical record by ID (Patient/Doctor)
router.get('/records/:id', protect, getRecordById);

// Route to search records based on patient ID
router.get('/records/patient/:patientId', protect, searchRecordsByPatientId);

// Route to search records by name and sort by date
router.get('/records/search', protect, searchRecordsByName);

module.exports = router;