const express = require('express');
const router = express.Router();
const {
    addReview,
    deleteReview,
    getAllReviews,
} = require('../controllers/rateAndReviewController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly, patientOnly } = require('../middlewares/roleMiddleware');

router.post('/', protect, patientOnly, addReview);
router.delete('/:id', protect, adminOnly, deleteReview);
router.get('/', protect, getAllReviews);

module.exports = router;