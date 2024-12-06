const asyncHandler = require('express-async-handler');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor');
const cron = require('node-cron');

// Create a new prescription
const createPrescription = asyncHandler(async (req, res) => {
    const { patient_id, doctor_id, appointment_id, medications, instructions, tests } = req.body;

    // Check if patient and doctor exist
    const patientExists = await Patient.findById(patient_id);
    const doctorExists = await Doctor.findById(doctor_id);

    if (!patientExists || !doctorExists) {
        res.status(404);
        throw new Error("Patient or Doctor not found.");
    }

    const prescription = await Prescription.create({
        patient_id,
        doctor_id,
        appointment_id,
        medications,
        instructions,
        tests,
    });

    res.status(201).json(prescription);
});

// Update an existing prescription
const updatePrescription = asyncHandler(async (req, res) => {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!prescription) {
        res.status(404);
        throw new Error("Prescription not found.");
    }

    res.json(prescription);
});

// View specific prescriptions by doctor or patient
const getPrescriptionById = asyncHandler(async (req, res) => {

    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
        res.status(404);
        throw new Error("Prescription not found.");
    }

    res.json(prescription);
});

// Get active prescriptions of a specific patient
const getActivePrescriptionsByPatientId = asyncHandler(async (req, res) => {
    const prescriptions = await Prescription.find({ patient_id: req.params.id, status: 'active' });

    if (!prescriptions) {
        res.status(404);
        throw new Error("Prescriptions not found.");
    }

    res.json(prescriptions);
});

// Schedule a job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const prescriptions = await Prescription.find({ status: 'active' });

        for (const prescription of prescriptions) {
            const medications = prescription.medications;

            // Find the largest duration
            const largestDuration = medications.reduce((max, med) => {
                const duration = parseInt(med.duration); // Assuming duration is a string representing a number
                return Math.max(max, duration);
            }, 0);

            // Calculate the date when the status should change
            const changeDate = new Date();
            changeDate.setDate(changeDate.getDate() + largestDuration);

            // Check if the current date is past the change date
            const now = new Date();
            if (now >= changeDate) {
                prescription.status = 'inactive';
                await prescription.save(); // Save the updated status
            }
        }
        console.log('Prescription statuses updated successfully.');
    } catch (error) {
        console.error('Error updating prescription statuses:', error);
    }
});

// View all prescriptions
const getAllPrescriptions = asyncHandler(async (req, res) => {
    const prescriptions = await Prescription.find({});
    res.json(prescriptions);
});

module.exports = {
    createPrescription,
    updatePrescription,
    getPrescriptionById,
    getAllPrescriptions,
    getActivePrescriptionsByPatientId
};
