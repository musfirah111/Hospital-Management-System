const express = require('express');
const router = express.Router();
const { 
    addPatient, 
    getPatientDetails, 
    updatePatient, 
    deletePatient, 
    requestCancellation, 
    searchDoctors 
} = require('../controllers/patientController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly, patientOnly } = require('../middlewares/roleMiddleware');

router.post('/', protect, adminOnly, addPatient);
router.get('/:id', protect, getPatientDetails);
router.put('/:id', protect, updatePatient);
router.delete('/:id', protect, adminOnly, deletePatient);
router.post('/cancel-request', protect, patientOnly, requestCancellation);
router.get('/search', protect, searchDoctors);

module.exports = router;