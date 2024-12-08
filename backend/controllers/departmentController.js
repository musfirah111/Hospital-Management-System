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

// Get all departments
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find({});
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update department status
const updateDepartmentStatus = async (req, res) => {
    try {
        const { active_status } = req.body;
        if (typeof active_status !== 'boolean') {
            return res.status(400).json({ message: 'Active status must be a boolean value' });
        }

        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { active_status },
            { new: true }
        );
        
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        
        res.status(200).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Export the controller functions
module.exports = {
    addDepartment,
    updateDepartment,
    deleteDepartment,
    getAllDepartments,
    updateDepartmentStatus
};
