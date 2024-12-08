const express = require('express');
const {
    //getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDailySchedule,
    getWeeklySchedule,
    getAllDoctors,
    getDoctorCountByDepartment,
    getDoctorByUserId
} = require('../controllers/doctorController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly, doctorOnly } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Route to get all doctors - accessible to all authenticated users.
//router.get('/', protect, getDoctors);

// Route to get the count of doctors in each department
router.get('/count', protect, getDoctorCountByDepartment);

router.get('/', protect, getAllDoctors);

// Route to get a doctor by ID - accessible to all authenticated users.
router.get('/:id', protect, getDoctorById);

// Route to get a doctor by user ID - accessible to all authenticated users.
router.get('/user/:userId', protect, getDoctorByUserId);

// Route to create a new doctor - admin only.
router.post('/', protect, adminOnly, createDoctor);

// Route to update a doctor by ID - dcotors only.
router.put('/:id', protect, doctorOnly, updateDoctor);

// Route to delete a doctor by ID - admin only.
router.delete('/:id', protect, adminOnly, deleteDoctor);

// Schedule routes
router.get('/schedule/daily', protect, doctorOnly, getDailySchedule);
router.get('/schedule/weekly', protect, doctorOnly, getWeeklySchedule);

module.exports = router;