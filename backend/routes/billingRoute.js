const express = require('express');
const router = express.Router();
const {
    generateInvoice,
    payBill,
    downloadInvoice
} = require('../controllers/billingController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly, patientOnly } = require('../middlewares/roleMiddleware');

// Admin routes
router.post('/invoice/generate', protect, adminOnly, generateInvoice);

// Patient routes
router.post('/pay', protect, patientOnly, payBill);
router.get('/download/:invoiceId', protect, downloadInvoice);

module.exports = router; 