// backend/routes/user.js
const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    updateUserByUserId,
    getUserProfileById
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Route for registering a new user
router.post('/register', registerUser);

// Route for logging in a user.
router.post('/login', loginUser);

// Route for getting user profile.
router.get('/profile', protect, getUserProfile);

// Route for updating user profile
router.put('/profile', protect, updateUserProfile);

// Add this route to your existing routes
router.put('/user/:userId', protect, updateUserByUserId);

router.get('/user/:userId', protect, getUserProfileById);

module.exports = router;