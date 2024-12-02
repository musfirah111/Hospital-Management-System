// backend/models/Department.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, `Please enter the department name.`], 
        unique: true 
    },
    description: { 
        type: String, 
        default: '' 
    }, 
    active_status: { 
        type: Boolean, 
        required: [true, `Please enter the active status.`] 
    },
    staff_count: { 
        type: Number, 
        default: 0 
    },
    head_of_department: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: [true, `Please enter the head of department.`] 
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;