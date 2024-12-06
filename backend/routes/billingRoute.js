const express = require('express');
const router = express.Router();
const {
    generateInvoice,
    payBill,
    downloadInvoice,
    refundPayment
} = require('../controllers/billingController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly, patientOnly } = require('../middlewares/roleMiddleware');

// Admin routes
router.post('/invoice/generate', protect, adminOnly, generateInvoice);

// Patient routes
router.post('/pay', protect, patientOnly, payBill);
router.get('/download/:invoiceId', protect, downloadInvoice);

// Add this new route
router.post('/refund', protect, adminOnly, refundPayment);

module.exports = router; 