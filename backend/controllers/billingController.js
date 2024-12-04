const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const Invoice = require('../models/Billing');
const Patient = require('../models/Patient');
const User = require('../models/User');

// Generate Invoice - Admin Only
const generateInvoice = async (req, res) => {
    try {
        const { patientId, items, totalAmount, dueDate, appointmentId } = req.body;

        // Check if the patient exists and populate user data
        const patient = await Patient.findById(patientId).populate('user_id');
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Create or get customer in Stripe
        let customer;
        if (patient.stripe_customer_id) {
            customer = await stripe.customers.retrieve(patient.stripe_customer_id);
        } else {
            customer = await stripe.customers.create({
                email: patient.user_id.email,
                name: patient.user_id.name,
                metadata: {
                    patientId: patient._id.toString()
                }
            });
            patient.stripe_customer_id = customer.id;
            await patient.save();
        }

        // First create invoice in Stripe
        const stripeInvoice = await stripe.invoices.create({
            customer: customer.id,
            currency: 'pkr',
            collection_method: 'send_invoice',
            days_until_due: 30
        });

        // Add items to the invoice
        for (const item of items) {
            await stripe.invoiceItems.create({
                customer: customer.id,
                invoice: stripeInvoice.id,
                currency: 'pkr',
                unit_amount: item.amount * 100, // Convert to paisa
                quantity: item.quantity,
                description: item.description
            });
        }

        // Add total amount as a separate line item if needed
        if (totalAmount > items.reduce((sum, item) => sum + (item.amount * item.quantity), 0)) {
            const additionalFees = totalAmount - items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
            await stripe.invoiceItems.create({
                customer: customer.id,
                invoice: stripeInvoice.id,
                currency: 'pkr',
                unit_amount: additionalFees * 100,
                quantity: 1,
                description: 'Additional Fees'
            });
        }

        // Finalize the invoice
        const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id);

        // Create invoice in our database
        const invoice = await Invoice.create({
            patient_id: patientId,
            appointment_id: appointmentId,
            items,
            total_amount: totalAmount,
            due_date: dueDate,
            stripe_invoice_id: finalizedInvoice.id,
            payment_status: 'Unpaid'
        });

        // Send the invoice
        await stripe.invoices.sendInvoice(finalizedInvoice.id);

        res.status(201).json({
            success: true,
            message: 'Invoice generated successfully',
            data: {
                invoice,
                stripeInvoiceId: finalizedInvoice.id,
                hostedInvoiceUrl: finalizedInvoice.hosted_invoice_url
            }
        });

    } catch (error) {
        console.error('Generate Invoice Error:', error);
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
        const { invoiceId } = req.body;

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        // Retrieve the invoice from Stripe
        const stripeInvoice = await stripe.invoices.retrieve(invoice.stripe_invoice_id);

        // Check if the invoice is open
        if (stripeInvoice.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'Invoice is not open and cannot be approved'
            });
        }

        // Mark the invoice as paid in Stripe
        await stripe.invoices.pay(invoice.stripe_invoice_id);

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
        console.error('Approve Payment Error:', error);
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

        // Create payment intent with the provided payment method
        const paymentIntent = await stripe.paymentIntents.create({
            amount: invoice.total_amount * 100,
            currency: 'pkr',
            payment_method: paymentMethodId,
            confirm: true,
            payment_method_types: ['card'],
            description: `Payment for invoice ${invoice._id}`,
            metadata: {
                invoice_id: invoice._id.toString()
            }
        });

        // Pay the invoice in Stripe
        await stripe.invoices.pay(invoice.stripe_invoice_id, {
            paid_out_of_band: true // Mark as paid externally
        });

        // Update local database
        invoice.payment_status = 'Paid';
        invoice.amount_paid = invoice.total_amount;
        invoice.payment_intent_id = paymentIntent.id;
        invoice.date_of_payment = new Date();
        await invoice.save();

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            data: {
                invoice,
                clientSecret: paymentIntent.client_secret
            }
        });
    } catch (error) {
        console.error('Pay Bill Error:', error);
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

        // Find the invoice in our database
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        // Get the invoice from Stripe
        const stripeInvoice = await stripe.invoices.retrieve(invoice.stripe_invoice_id);

        // Check if the hosted invoice URL is available
        if (!stripeInvoice.hosted_invoice_url) {
            return res.status(404).json({
                success: false,
                message: 'Invoice URL not available yet. Please try again in a few moments.'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                invoiceUrl: stripeInvoice.hosted_invoice_url,
                invoiceNumber: stripeInvoice.number,
                amount: stripeInvoice.amount_due,
                status: stripeInvoice.status
            }
        });
    } catch (error) {
        console.error('Download Invoice Error:', error);
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
