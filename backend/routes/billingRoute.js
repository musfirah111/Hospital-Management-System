const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly, patientOnly } = require('../middlewares/roleMiddleware');
const {
    generateInvoice,
    approvePayment,
    payBill,
    downloadInvoice
} = require('../controllers/billingController');

const router = express.Router();

// Admin routes
router.post('/invoice/generate', protect, adminOnly, generateInvoice);
router.put('/invoice/approve', protect, adminOnly, approvePayment);

// Patient routes
router.post('/invoice/pay', protect, patientOnly, payBill);
router.get('/invoice/download/:invoiceId', protect, patientOnly, downloadInvoice);

module.exports = router; 