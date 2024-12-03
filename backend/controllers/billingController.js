const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Invoice = require('../models/Invoice');
const Patient = require('../models/Patient');
const User = require('../models/User');

// Generate Invoice - Admin Only
const generateInvoice = async (req, res) => {
    try {
        const { patientId, items, totalAmount, dueDate } = req.body;

        // Create invoice in Stripe
        const stripeInvoice = await stripe.invoices.create({
            customer: patientId,
            collection_method: 'send_invoice',
            days_until_due: 30,
        });

        // Create invoice in our database
        const invoice = await Invoice.create({
            patient_id: patientId,
            items,
            total_amount: totalAmount,
            due_date: dueDate,
            stripe_invoice_id: stripeInvoice.id,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating invoice',
            error: error.message
        });
    }
};

// Payment Accept - Admin
const approvePayment = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        // Update invoice status in Stripe
        await stripe.invoices.markUncollectible(invoice.stripe_invoice_id);

        // Update invoice status in our database
        invoice.status = 'paid';
        await invoice.save();

        // TODO: Send notification to patient about payment approval
        
        res.status(200).json({
            success: true,
            message: 'Payment approved successfully',
            data: invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving payment',
            error: error.message
        });
    }
};

// Bill Pay - Patient
const payBill = async (req, res) => {
    try {
        const { invoiceId, paymentMethodId } = req.body;

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        // Process payment through Stripe
        const payment = await stripe.paymentIntents.create({
            amount: invoice.total_amount * 100,
            currency: 'pkr',
            payment_method: paymentMethodId,
            confirm: true,
            payment_method_types: ['card'],
            description: `Test payment for invoice ${invoice._id}`
        });

        // Update invoice status
        invoice.status = 'pending_approval';
        invoice.payment_intent_id = payment.id;
        await invoice.save();

        res.status(200).json({
            success: true,
            message: 'Test payment processed successfully',
            data: {
                invoice,
                clientSecret: payment.client_secret
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
};

// Download Invoice - Patient
const downloadInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const invoice = await Invoice.findById(invoiceId)
            .populate('patient_id');

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        // Get invoice PDF from Stripe
        const invoicePdf = await stripe.invoices.retrieve(invoice.stripe_invoice_id, {
            expand: ['invoice.pdf']
        });

        res.status(200).json({
            success: true,
            data: {
                pdfUrl: invoicePdf.invoice_pdf
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error downloading invoice',
            error: error.message
        });
    }
};

module.exports = {
    generateInvoice,
    approvePayment,
    payBill,
    downloadInvoice
};
