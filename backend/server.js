// Load env variables first, before any other imports
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorHandler');

// Import routes
const userRoutes = require('./routes/userRoute');
const doctorRoutes = require('./routes/doctorRoute');
const patientRoutes = require('./routes/patientRoute');
const departmentRoutes = require('./routes/departmentRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoute');
const appointmentRoutes = require('./routes/appointmentRoute');
const statisticsRoutes = require('./routes/statisticsRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoute');
const labReportRoutes = require('./routes/medicalLabTestReportRoute');
const reviewRoutes = require('./routes/rateAndReviewRoute');
const billingRoutes = require('./routes/billingRoute');
const recommendationRoutes = require('./routes/recommendationRoute');
const communicationRoutes = require('./routes/communicationRoute');

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
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/lab-reports', labReportRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/communication', communicationRoutes);

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