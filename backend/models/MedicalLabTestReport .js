const mongoose = require('mongoose');

const MedicalLabTestReportSchema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Please enter a patient id.']
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Please enter a doctor id.']
    },
    test_name: {
        type: String,
        required: [true, 'Please enter a test name.']
    },
    test_date: {
        type: Date,
        required: [true, 'Please enter a test date.']
    },
    result: {
        type: String,
        required: [true, 'Please enter a test result.']
    }
});

// Export the model
const MedicalLabTestReport = mongoose.model('MedicalLabTestReport', MedicalLabTestReportSchema);
module.exports = MedicalLabTestReport;
