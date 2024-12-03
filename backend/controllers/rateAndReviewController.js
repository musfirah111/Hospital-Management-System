const asyncHandler = require('express-async-handler');
const Review = require('../models/Review'); // Assuming you have a Review model

// Add a review (Patient)
const addReview = asyncHandler(async (req, res) => {
    const { doctor_id, patient_id } = req.body;

    try {
        // Verify if the doctor exists
        const doctorExists = await Doctor.findById(doctor_id);
        if (!doctorExists) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Verify if the patient exists
        const patientExists = await Patient.findById(patient_id);
        if (!patientExists) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a review (Admin)
const deleteReview = asyncHandler(async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// View all reviews with patient and doctor names
const getAllReviews = asyncHandler(async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate({
                path: 'patient_id',
                select: 'name',
                model: 'Patient'
            })
            .populate({
                path: 'doctor_id',
                select: 'name department',
                model: 'Doctor'
            }); 
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export the controller functions
module.exports = {
    addReview,
    deleteReview,
    getAllReviews,
};