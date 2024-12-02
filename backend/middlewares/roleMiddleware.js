const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const asyncHandler = require('express-async-handler');

// Middleware to check if user has required role
const checkRole = (roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized - insufficient permissions' });
        }

        next();
    });
};

// Specific role middleware functions
const adminOnly = checkRole(['admin']);
const doctorOnly = checkRole(['doctor']);
const patientOnly = checkRole(['patient']);

module.exports = { checkRole, adminOnly, doctorOnly, patientOnly };