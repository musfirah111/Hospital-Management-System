const express = require('express');
const { getDoctorRecommendations } = require('../controllers/recommendationController');

const router = express.Router();

// Route to get doctor recommendations based on patient ID from the request body
router.post('/recommendations', getDoctorRecommendations);

// ... existing routes ...
