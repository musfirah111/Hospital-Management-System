const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const MedicalRecord = require('../models/MedicalRecord');

// Create a new medical record (Doctor)
const createRecord = asyncHandler(async (req, res) => {
    try {
        const record = new MedicalRecord(req.body);
        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// View a medical record by ID (Patient/Doctor)
const getRecordById = asyncHandler(async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search records based on patient ID
const searchRecordsByPatientId = asyncHandler(async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patient_id: req.params.patientId });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search records by name and sort by date
const searchRecordsByName = asyncHandler(async (req, res) => {
    try {
        const records = await MedicalRecord.find({ name: req.query.name }).sort({ date: -1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export the controller functions
module.exports = {
    createRecord,
    getRecordById,
    searchRecordsByPatientId,
    searchRecordsByName,
};