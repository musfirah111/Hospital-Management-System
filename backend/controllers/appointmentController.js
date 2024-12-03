const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const moment = require('moment');

// Function to get available time slots.
const getAvailableTimeSlots = async (doctorId, date) => {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.availability_status) {
        return [];
    }

    // Define possible time slots based on doctor's shift.
    const timeSlots = {
        'Morning': ['09:00', '10:00', '11:00', '12:00'],
        'Evening': ['14:00', '15:00', '16:00', '17:00'],
        'Night': ['18:00', '19:00', '20:00', '21:00']
    };

    // Get all appointments for the doctor on the given date.
    const existingAppointments = await Appointment.find({
        doctor_id: doctorId,
        appointment_date: {
            $gte: moment(date).startOf('day'),
            $lte: moment(date).endOf('day')
        },
        status: { $nin: ['Cancelled'] }
    });

    const bookedTimes = existingAppointments.map(apt => apt.appointment_time);
    const availableSlots = timeSlots[doctor.shift].filter(
        time => !bookedTimes.includes(time)
    );

    return availableSlots;
};

// Create appointment.
const createAppointment = asyncHandler(async (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    if (!doctor.availability_status) {
        res.status(400);
        throw new Error('Doctor is not available for appointments.');
    }

    // Check if the requested time slot is available.
    const availableSlots = await getAvailableTimeSlots(
        doctor_id,
        appointment_date
    );

    if (!availableSlots.includes(appointment_time)) {
        res.status(400);
        return res.json({
            message: 'Selected time slot is not available.',
            availableSlots: availableSlots,
            suggestedDate: moment(appointment_date).format('YYYY-MM-DD')
        });
    }

    // Create the appointment.
    const appointment = await Appointment.create({
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status: 'Scheduled'
    });

    res.status(201).json(appointment);
});

// Get all appointments.
const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({})
        .populate('patient_id')
        .populate('doctor_id');
    res.json(appointments);
});

// Get appointment by ID.
const getAppointmentById = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id)
        .populate('patient_id')
        .populate('doctor_id');

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    res.json(appointment);
});

// Update appointment status.
const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found.');
    }

    res.json(appointment);
});

// Update/Reschedule appointment.
const updateAppointment = asyncHandler(async (req, res) => {
    const { appointment_date, appointment_time, status, reminder_sent } = req.body;
    const appointmentId = req.params.id;

    // Find existing appointment.
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    // If date or time is being updated, check availability.
    if (appointment_date || appointment_time) {
        const availableSlots = await getAvailableTimeSlots(
            appointment.doctor_id,
            appointment_date || appointment.appointment_date
        );

        // If checking the same day, include current appointment time in available slots.
        if (moment(appointment_date).isSame(appointment.appointment_date, 'day')) {
            availableSlots.push(appointment.appointment_time);
        }

        if (appointment_time && !availableSlots.includes(appointment_time)) {
            res.status(400);
            return res.json({
                message: 'Selected time slot is not available.',
                availableSlots: availableSlots,
                suggestedDate: moment(appointment_date || appointment.appointment_date).format('YYYY-MM-DD')
            });
        }
    }

    // Update only allowed fields.
    const updateFields = {};
    if (appointment_date) updateFields.appointment_date = appointment_date;
    if (appointment_time) updateFields.appointment_time = appointment_time;
    if (status) updateFields.status = status;
    if (reminder_sent !== undefined) updateFields.reminder_sent = reminder_sent;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        updateFields,
        { new: true }
    ).populate('doctor_id patient_id');

    res.json(updatedAppointment);
});

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    updateAppointment
};
