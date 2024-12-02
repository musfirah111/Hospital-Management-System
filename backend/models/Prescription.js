const mongoose = require('mongoose');
const { Schema } = mongoose;

const prescriptionSchema = new Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Please enter the patient ID.']
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Please enter the doctor ID.']
    },
    medications: [{
        name: {
            type: String,
            required: [true, 'Please enter the medication name.']
        },
        dosage: {
            type: String,
            required: [true, 'Please enter the dosage.']
        },
        frequency: {
            type: String,
            required: [true, 'Please enter the frequency.']
        },
        duration: {
            type: String,
            required: [true, 'Please enter the duration.']
        }
    }],
    instructions: {
        type: String,
        required: false
    },
    date_issued: {
        type: Date,
        required: [true, 'Please enter the date issued.'],
        default: Date.now
    },
    tests: [{
        test_name: String
    }]
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
