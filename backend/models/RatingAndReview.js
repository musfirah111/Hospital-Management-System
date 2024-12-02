const mongoose = require('mongoose');

const RatingAndReviewSchema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: false
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, `Please enter the doctor id.`]
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, `Please enter the department id.`]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, `Please enter the rating.`]
    },
    review: {
        type: String,
        required: false
    },
    date_given: {
        type: Date,
        default: Date.now
    }
});

const RatingAndReview = mongoose.model('RatingAndReview', RatingAndReviewSchema);

module.exports = RatingAndReview;
