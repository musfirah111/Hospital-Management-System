const Doctor = require('../models/Doctor');

// Create a new doctor
async function createDoctor(req, res) {
    try {
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).json(doctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all doctors
async function getAllDoctors(req, res) {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a doctor by ID
async function getDoctorById(req, res) {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a doctor by ID
async function updateDoctor(req, res) {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.status(200).json(doctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a doctor by ID
async function deleteDoctor(req, res) {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Export the controller functions
module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};
