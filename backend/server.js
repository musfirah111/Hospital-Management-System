const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorHandler');

// Loads env variables
dotenv.config();

// Connection to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/doctors', require('./routes/doctorRoute'));
app.use('/api/patients', require('./routes/patientRoute'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoute'));
app.use('/api/appointments', require('./routes/appointmentRoute'));
app.use('/api/statistics', require('./routes/statisticsRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoute'));
app.use('/api/lab-reports', require('./routes/medicalLabTestReportRoute'));
app.use('/api/reviews', require('./routes/rateAndReviewRoute'));
app.use('/api/billing', require('./routes/billingRoute'));
app.use('/api/recommendations', require('./routes/recommendationRoute'));

// Error Handler Middleware
app.use(errorHandler);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});