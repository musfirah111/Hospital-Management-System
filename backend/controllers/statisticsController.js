const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const RatingAndReview = require('../models/RatingAndReview');

// Get average rating for a specific doctor.
const getDoctorRating = asyncHandler(async (req, res) => {
    const { doctor_id } = req.params;

    const reviews = await RatingAndReview.find({ doctor_id });

    if (reviews.length === 0) {
        return res.json({ averageRating: 0, totalReviews: 0 });
    }

    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    res.json({
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: reviews.length
    });
});

// Get top rated doctors by department.
const getTopRatedDoctorsByDepartment = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit || 5); // Default to 5 doctors.

    // Get all doctors with their user and department details.
    const doctors = await Doctor.find({})
        .populate('user_id', 'name')
        .populate('department_id', 'name');

    const departmentDoctors = {}; // Group doctors by department.

    doctors.forEach(doctor => {
        const deptId = doctor.department_id._id.toString();
        if (!departmentDoctors[deptId]) {
            departmentDoctors[deptId] = {
                department_name: doctor.department_id.name,
                doctors: []
            };
        }
        departmentDoctors[deptId].doctors.push(doctor);
    });

    const departmentRatings = {}; // Store department ratings.

    for (const [deptId, data] of Object.entries(departmentDoctors)) {
        const ratings = [];

        // Compute ratings for each doctor.
        for (const doctor of data.doctors) {
            const reviews = await RatingAndReview.find({ doctor_id: doctor._id });

            let avgRating;
            if (reviews.length > 0) {
                avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            } else {
                avgRating = 0;
            }

            ratings.push({
                doctor_name: doctor.user_id.name,
                department: data.department_name,
                averageRating: Number(avgRating.toFixed(1)),
                totalReviews: reviews.length
            });
        }

        // Sort by average rating and limit to top 5.
        ratings.sort((a, b) => b.averageRating - a.averageRating);
        departmentRatings[deptId] = {
            department_name: data.department_name,
            top_rated: ratings.slice(0, limit) // Top 5 doctors.
        };
    }

    res.json(departmentRatings);
});

module.exports = {
    getDoctorRating,
    getTopRatedDoctorsByDepartment
};
