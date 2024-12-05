const express = require('express');
const router = express.Router();
const {
    addPatient,
    getPatientDetails,
    updatePatient,
    deletePatient,
    requestCancellation,
    searchDoctors,
    getDailyRegistrations,
    getWeeklyRegistrations,
    getMonthlyRegistrations,
    getAllPatients
} = require('../controllers/patientController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly, patientOnly, adminOrPatient } = require('../middlewares/roleMiddleware');

router.get('/daily-registrations', protect, getDailyRegistrations);
router.get('/weekly-registrations', protect, getWeeklyRegistrations);
router.get('/monthly-registrations', protect, getMonthlyRegistrations);
router.post('/', protect, adminOnly, addPatient);
router.get('/:id', protect, getPatientDetails);
router.get('/', protect, getAllPatients);
router.put('/:id', protect, adminOrPatient, updatePatient);
router.delete('/:id', protect, adminOnly, deletePatient);
router.post('/cancel-request', protect, patientOnly, requestCancellation);
router.get('/search', protect, searchDoctors);


module.exports = router;