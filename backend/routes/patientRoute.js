const express = require('express');
const { addPatient, getPatientDetails, updatePatient, deletePatient, requestCancellation, searchDoctors } = require('../controllers/patientController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const { patientOnly } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Route for adding a new patient.
router.post('/', protect, adminOnly, addPatient);

// Route for getting patient details.
router.get('/:id', protect, getPatientDetails);

// Route for updating patient information.
router.put('/:id', protect, updatePatient);

// Route for deleting a patient.
router.delete('/:id', protect, adminOnly, deletePatient);

// Route for requesting appointment cancellation.
router.post('/cancel-request', protect, patientOnly, requestCancellation);

// Route for searching doctors.
router.get('/search', protect, searchDoctors);

module.exports = router;