const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient'); 
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Add a new patient
const addPatient = asyncHandler(async (req, res) => {
    // Check if the patient already exists
    const existingPatient = await Patient.findOne({ user_id: req.body.user_id });

    if (existingPatient) {
        res.status(400);
        throw new Error("Patient already exists for this user ID.");
    }

    const patient = await Patient.create(req.body);

    res.status(201).json(patient);
});

// Get patient details
const getPatientDetails = asyncHandler(async (req, res) => {
    // First, find the patient by ID
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        res.status(404);
        throw new Error("Patient not found.");
    }

    // Then, find the user associated with the patient
    const user = await User.findById(patient.user_id); // Retrieve the entire user object

    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    // Include user details in the response
    res.json({
        id: patient._id,
        user: user, // Return the entire user object
        address: patient.address,
        emergency_contact: patient.emergency_contact,
    });
});

// Update patient information
const updatePatient = asyncHandler(async (req, res) => {
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

// Request an appointment
const requestAppointment = asyncHandler(async (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    // Check if patient exists
    const patientExists = await Patient.findById(patient_id);
    if (!patientExists) {
        res.status(404);
        throw new Error("Patient not found.");
    }

    // Check if doctor exists
    const doctorExists = await Doctor.findById(doctor_id);
    if (!doctorExists) {
        res.status(404);
        throw new Error("Doctor not found.");
    }

    // Create the appointment request
    const appointmentRequest = await Appointment.create({
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status: 'Requested', // Set status to 'Requested'
    });

    res.status(201).json(appointmentRequest);
});

module.exports = { addPatient, getPatientDetails, updatePatient, deletePatient, requestAppointment };
