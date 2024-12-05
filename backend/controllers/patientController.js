const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');
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

// Request appointment cancellation.
const requestCancellation = asyncHandler(async (req, res) => {
    const { appointment_id, cancellation_reason } = req.body;

    // Check if appointment exists.
    const appointment = await Appointment.findById(appointment_id)
        .populate('doctor_id')
        .populate('patient_id');

    if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found.");
    }

    // Check if appointment can be cancelled
    if (['Cancelled', 'Completed', 'Requested'].includes(appointment.status)) {
        res.status(400);
        throw new Error("Cannot request cancellation for an appointment that is already cancelled, completed, or has a pending request.");
    }

    // Update appointment status to cancellation requested.
    const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointment_id,
        {
            status: 'Requested',
            cancellation_reason,
            cancellation_requested_at: Date.now()
        },
        { new: true }
    ).populate('doctor_id patient_id');

    res.status(200).json(updatedAppointment);
});

// Search for doctors based on name, department, or disease
const searchDoctors = asyncHandler(async (req, res) => {
    const { name, department, disease } = req.query;

    const searchCriteria = {};
    if (name) {
        searchCriteria.name = { $regex: name, $options: 'i' };
    }
    if (department) {
        searchCriteria.department = { $regex: department, $options: 'i' };
    }
    if (disease) {
        searchCriteria.disease = { $regex: disease, $options: 'i' };
    }

    const doctors = await Doctor.find(searchCriteria);

    res.json(doctors);
});

const getDailyRegistrations = asyncHandler(async (req, res) => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Subtract 24 hours

    const dailyCount = await User.countDocuments({
        role: "Patient", // Ensure only patients are counted
        date_created: { $gte: last24Hours },
    });

    res.json({ dailyCount });
});

const getWeeklyRegistrations = asyncHandler(async (req, res) => {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Subtract 7 days

    const weeklyCount = await User.countDocuments({
        role: "Patient", // Ensure only patients are counted
        date_created: { $gte: last7Days },
    });

    res.json({ weeklyCount });
});

const getMonthlyRegistrations = asyncHandler(async (req, res) => {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Subtract 30 days

    const monthlyCount = await User.countDocuments({
        role: "Patient", // Ensure only patients are counted
        date_created: { $gte: last30Days },
    });

    res.json({ monthlyCount });
});




module.exports = { addPatient, getPatientDetails, updatePatient, deletePatient, requestCancellation, searchDoctors, getDailyRegistrations, getWeeklyRegistrations, getMonthlyRegistrations };
