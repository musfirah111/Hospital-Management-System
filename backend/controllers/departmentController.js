const asyncHandler = require('express-async-handler');
const Department = require('../models/Department'); // Assuming you have a Department model

// Add a new department
const addDepartment = async (req, res) => {
    try {
        const department = new Department(req.body);
        await department.save();
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a department
const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!department) return res.status(404).json({ message: 'Department not found' });
        res.status(200).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a department
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) return res.status(404).json({ message: 'Department not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllDepartments = asyncHandler(async (req, res) => {
    const departments = await Department.find({ active_status: true });
    res.json(departments);
});

// Export the controller functions
module.exports = {
    addDepartment,
    updateDepartment,
    deleteDepartment,
    getAllDepartments
};
