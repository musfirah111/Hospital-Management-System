const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient'); 
const mongoose = require('mongoose');

// Add a new patient
const addPatient = asyncHandler(async (req, res) => {
    const { user_id, address, emergency_contact } = req.body;

    if (!user_id || !emergency_contact || !emergency_contact.name || !emergency_contact.phone || !emergency_contact.relationship) {
        res.status(400);
        throw new Error("Please add all required fields.");
    }

    // Check if the patient already exists
    const existingPatient = await Patient.findOne({ user_id });

    if (existingPatient) {
        res.status(400);
        throw new Error("Patient already exists for this user ID.");
    }

    const patient = await Patient.create({
        user_id,
        address,
        emergency_contact,
    });

    res.status(201).json(patient);
});

// Get patient details
const getPatientDetails = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        res.status(404);
        throw new Error("Patient not found.");
    }

    res.json(patient);
});

// Update patient information
const updatePatient = asyncHandler(async (req, res) => {
    const { address, emergency_contact } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedPatient) {
        res.status(404);
        throw new Error("Patient not found.");
    }

    res.json(updatedPatient);
});

// Delete a patient
const deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
        res.status(404);
        throw new Error("Patient not found.");
    }

    res.json({ message: "Patient deleted successfully." });
});

module.exports = { addPatient, getPatientDetails, updatePatient, deletePatient };
