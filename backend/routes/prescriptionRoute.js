const express = require('express');
const router = express.Router();
const {
    createPrescription,
    updatePrescription,
    getPrescriptionById,
    getAllPrescriptions,
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware'); 
const { doctorOnly } = require('../middleware/roleMiddleware');

// Route to create a new prescription
router.post('/prescriptions', protect, doctorOnly, createPrescription);

// Route to update an existing prescription
router.put('/prescriptions/:id', protect, doctorOnly, updatePrescription);

// Route to get a specific prescription by ID
router.get('/prescriptions/:id', getPrescriptionById);

// Route to get all prescriptions
router.get('/prescriptions', getAllPrescriptions);

module.exports = router;