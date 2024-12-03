const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Get all doctors.
const getDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({}).populate('user_id department_id');
    res.json(doctors);
});

// Get doctor by ID.
const getDoctorById = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id).populate('user_id department_id');

    if (!doctor) {
        res.status(404);
        throw new Error("Doctor not found.");
    }

    res.json(doctor);
});

// Create a new doctor.
const createDoctor = asyncHandler(async (req, res) => {
    const existingDoctor = await Doctor.findOne({ user_id: req.body.user_id });

    if (existingDoctor) {
        res.status(400);
        throw new Error("Doctor already exists for this user ID.");
    }

    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
});

// Update doctor information.
const updateDoctor = asyncHandler(async (req, res) => {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!updatedDoctor) {
        res.status(404);
        throw new Error("Doctor not found.");
    }

    res.json(updatedDoctor);
});

// Delete a doctor.
const deleteDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
        res.status(404);
        throw new Error("Doctor not found.");
    }

    res.json({ message: "Doctor deleted successfully." });
});

module.exports = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};
