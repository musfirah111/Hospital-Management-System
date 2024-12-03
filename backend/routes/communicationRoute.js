const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    initializeChat,
    createChannel,
    deleteChannel
} = require('../controllers/communicationController');

router.post('/initialize', protect, initializeChat);
router.post('/channel', protect, createChannel);
router.delete('/channel', protect, deleteChannel);

module.exports = router;