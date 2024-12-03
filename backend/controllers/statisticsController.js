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
    const limit = parseInt(req.query.limit || 5);

    // Get all doctors grouped by department.
    const doctors = await Doctor.find({})
        .populate('user_id', 'name')
        .populate('department_id', 'name');

    // Group doctors by department.
    const departmentDoctors = {};
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

    // Calculate ratings for each department.
    const departmentRatings = {};
    for (const [deptId, data] of Object.entries(departmentDoctors)) {
        let ratings = [];

        // Calculate rating for each doctor in department.
        for (let doctor of data.doctors) {
            const doctorReviews = await RatingAndReview.find({ doctor_id: doctor._id });

            const average = doctorReviews.length
                ? doctorReviews.reduce((sum, review) => sum + review.rating, 0) / doctorReviews.length
                : 0;

            ratings.push({
                doctor_id: doctor._id,
                doctor_name: doctor.user_id.name,
                department: data.department_name,
                averageRating: Number(average.toFixed(1)),
                totalReviews: doctorReviews.length
            });
        }

        // Sort ratings from highest to lowest.
        ratings.sort((a, b) => b.averageRating - a.averageRating);
        departmentRatings[deptId] = {
            department_name: data.department_name,
            highest_rated: ratings[0] || null,
            lowest_rated: ratings[ratings.length - 1] || null,
            top_rated: ratings.slice(0, limit)
        };
    }

    res.json(departmentRatings);
});

module.exports = {
    getDoctorRating,
    getTopRatedDoctorsByDepartment
};
