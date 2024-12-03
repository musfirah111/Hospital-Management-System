const asyncHandler = require('express-async-handler');
const Prescription = require('../models/Prescription'); 
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor'); 

// Create a new prescription
const createPrescription = asyncHandler(async (req, res) => {
    const { patient_id, doctor_id, medications, instructions, tests } = req.body;

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
};
