const express = require('express');
const router = express.Router();
const {
    getDoctorRating,
    getTopRatedDoctorsByDepartment
} = require('../controllers/statisticsController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

router.get('/ratings/doctor/:doctor_id', protect, adminOnly, getDoctorRating);
router.get('/ratings/departments/top-doctors', protect, adminOnly, getTopRatedDoctorsByDepartment);

module.exports = router;