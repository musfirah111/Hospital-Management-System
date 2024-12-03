const express = require('express');
const router = express.Router();

const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    updateAppointment,
    requestAppointmentOrReschedule
} = require('../controllers/appointmentController');

const { protect } = require('../middlewares/authMiddleware');

const {
    adminOnly,
    doctorOnly,
    patientOnly
} = require('../middlewares/roleMiddleware');

// Route to create a new appointment (admin only).
router.post('/', protect, adminOnly, createAppointment);

// Route to get all appointments (admin only).
router.get('/', protect, adminOnly, getAppointments);

// Route to get appointment by ID (protected).
router.get('/:id', protect, getAppointmentById);

// Route to update appointment status (doctor only).
router.put('/:id/status', protect, doctorOnly, updateAppointmentStatus);

// Route to update/reschedule appointment (admin only)
router.put('/:id', protect, adminOnly, updateAppointment);

// Route to request an appointment
router.post('/appointments/request-reschedule', protect, requestAppointmentOrReschedule);

module.exports = router; 