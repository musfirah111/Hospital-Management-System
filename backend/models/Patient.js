const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model.
        required: [true, 'Please enter a user ID.']
    },
    gender: {
        type: String,
        required: [true, 'Please enter the gender.'],
        enum: ['Male', 'Female', 'Other'],
        message: 'Gender should be one of the following: Male, Female, or Other.'
    },
    address: {
        type: String,
        required: false,
        minlength: [10, 'Address should be at least 10 characters long.'],
        maxlength: [200, 'Address cannot be longer than 200 characters.']
    },
    emergency_contact: [{
        name: {
            type: String,
            required: [true, 'Please enter the contact\'s name.']
        },
        phone: {
            type: String,
            required: [true, 'Please enter the contact\'s phone number.'],
            match: [/^(03[0-9]{2})[0-9]{7}$/, 'Phone number must be 10 digits long.']
        },
        relationship: {
            type: String,
            required: [true, 'Please enter the relationship to the patient.']
        }
    }],
    medical_history: [{
        doctor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',  // Reference to the Doctor model.
            required: [true, 'Please enter the doctor ID.']
        },
        diagnosis: {
            type: String,
            required: [true, 'Please enter the diagnosis.']
        },
        treatment: {
            type: String,
            required: [true, 'Please enter the treatment.']
        },
        date: {
            type: Date,
            required: [true, 'Please enter the date of diagnosis.'],
            default: Date.now
        }
    }]
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
