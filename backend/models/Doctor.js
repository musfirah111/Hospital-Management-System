const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please add a user id.']
    },
    specialization: {
        type: String,
        required: [true, 'Please add a specialization.']
    },
    qualification: {
        type: String,
        required: [true, 'Please add a qualification.']
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Please add a department id.']
    },
    shift: {
        type: String,
        required: [true, 'Please add a shift.'],
        enum: ['Morning', 'Evening', 'Night']
    },
    working_hours: {
        type: String,
        required: [true, 'Please add a working hours.']
    },
    availability_status: {
        type: Boolean,
        default: true,
        required: [true, 'Please add a availability status.']
    },
    rating: {
        type: Number,
        default: 0
    },
    date_of_joining: {
        type: Date,
        default: Date.now,
        required: [true, 'Please add a date of joining.']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
