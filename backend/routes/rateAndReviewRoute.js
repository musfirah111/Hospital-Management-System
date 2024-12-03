const express = require('express');
const router = express.Router();
const {
    addReview,
    deleteReview,
    getAllReviews,
} = require('../controllers/rateAndReviewController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const { patientOnly } = require('../middlewares/roleMiddleware');

// Route to add a review (Patient)
router.post('/reviews', protect, patientOnlyOnly, addReview);

// Route to delete a review (Admin)
router.delete('/reviews/:id', protect, adminOnly, deleteReview);

// Route to view all reviews
router.get('/reviews', protect, getAllReviews);

module.exports = router;