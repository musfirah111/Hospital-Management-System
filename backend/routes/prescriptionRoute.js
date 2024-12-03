const express = require('express');
const router = express.Router();
const {
    createPrescription,
    updatePrescription,
    getPrescriptionById,
    getAllPrescriptions,
} = require('../controllers/prescriptionController');
const { protect } = require('../middlewares/authMiddleware');
const { doctorOnly } = require('../middlewares/roleMiddleware');

// Route to create a new prescription
router.post('/', protect, doctorOnly, createPrescription);

// Route to update an existing prescription
router.put('/:id', protect, doctorOnly, updatePrescription);

// Route to get a specific prescription by ID
router.get('/:id', protect, getPrescriptionById);

// Route to get all prescriptions
router.get('/', protect, getAllPrescriptions);

module.exports = router;