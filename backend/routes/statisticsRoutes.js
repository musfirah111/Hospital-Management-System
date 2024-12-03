const express = require('express');
const router = express.Router();
const {
    getDoctorRating,
    getTopRatedDoctorsByDepartment
} = require('../controllers/statisticsController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

// Get rating for a specific doctor.
router.get('/ratings/doctor/:doctor_id', protect, adminOnly, getDoctorRating);

// Get top rated doctors by department.
router.get('/ratings/departments/top-doctors', protect, adminOnly, getTopRatedDoctorsByDepartment);

module.exports = router;