const asyncHandler = require('express-async-handler');
const moment = require('moment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

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

// Get doctor's schedule for a specific day.
const getDailySchedule = asyncHandler(async (req, res) => {
    const { doctor_id, date } = req.query;

    let targetDate;
    if (date) {
        targetDate = moment(date).startOf('day');
    } else {
        targetDate = moment().startOf('day');
    }

    // Verify doctor exists.
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor not found"
        });
    }

    // Get all appointments for the specified day.
    const appointments = await Appointment.find({
        doctor_id,
        appointment_date: {
            $gte: targetDate.toDate(),
            $lte: moment(targetDate).endOf('day').toDate()
        }
    }).populate('patient_id', 'name');

    // Define time slots based on doctor's shift.
    const timeSlots = {
        'Morning': ['09:00', '10:00', '11:00', '12:00'],
        'Evening': ['14:00', '15:00', '16:00', '17:00'],
        'Night': ['18:00', '19:00', '20:00', '21:00']
    };

    // Create schedule with availability.
    const schedule = timeSlots[doctor.shift].map(time => {
        const appointment = appointments.find(apt => apt.appointment_time === time);
        return {
            time,
            isBooked: !!appointment,
            appointment: appointment || null
        };
    });

    res.status(200).json({
        success: true,
        data: {
            date: targetDate.format('YYYY-MM-DD'),
            shift: doctor.shift,
            schedule
        }
    });
});

// Get doctor's schedule for a week.
const getWeeklySchedule = asyncHandler(async (req, res) => {
    const { doctor_id, start_date } = req.query;

    let weekStart;
    if (start_date) {
        weekStart = moment(start_date).startOf('week');
    } else {
        weekStart = moment().startOf('week');
    }
    const weekEnd = moment(weekStart).endOf('week');

    // Verify doctor exists.
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor not found"
        });
    }

    // Get all appointments for the week.
    const appointments = await Appointment.find({
        doctor_id,
        appointment_date: {
            $gte: weekStart.toDate(),
            $lte: weekEnd.toDate()
        }
    }).populate('patient_id', 'name');

    // Create weekly schedule.
    const weeklySchedule = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = moment(weekStart).add(i, 'days');
        const dayAppointments = appointments.filter(apt =>
            moment(apt.appointment_date).isSame(currentDate, 'day')
        );

        weeklySchedule.push({
            date: currentDate.format('YYYY-MM-DD'),
            dayOfWeek: currentDate.format('dddd'),
            appointments: dayAppointments.map(apt => ({
                time: apt.appointment_time,
                patient: apt.patient_id,
                status: apt.status
            }))
        });
    }

    res.status(200).json({
        success: true,
        data: {
            weekStart: weekStart.format('YYYY-MM-DD'),
            weekEnd: weekEnd.format('YYYY-MM-DD'),
            shift: doctor.shift,
            weeklySchedule
        }
    });
});

// Get all doctors with pagination
const getAllDoctors = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 7; // Default to 7 doctors per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const doctors = await Doctor.find()
        .skip(skip)
        .limit(limit)
        .populate('user_id department_id'); // Populate if needed

    const totalDoctors = await Doctor.countDocuments(); // Get total number of doctors

    res.json({
        totalDoctors,
        totalPages: Math.ceil(totalDoctors / limit),
        currentPage: page,
        doctors,
    });
});


// Get the count of doctors in each department
const getDoctorCountByDepartment = asyncHandler(async (req, res) => {
    const doctorCountByDepartment = await Doctor.aggregate([
        { $group: { _id: "$department_id", count: { $sum: 1 } } }
    ]);

    res.json(doctorCountByDepartment);
});


module.exports = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDailySchedule,
    getWeeklySchedule,
    getAllDoctors,
    getDoctorCountByDepartment
};
