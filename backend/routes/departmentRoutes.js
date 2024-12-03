const express = require('express');
const router = express.Router();
const { 
    addDepartment, 
    updateDepartment, 
    deleteDepartment 
} = require('../controllers/departmentController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

// All routes are protected and admin-only
router.post('/', protect, adminOnly, addDepartment);
router.put('/:id', protect, adminOnly, updateDepartment);
router.delete('/:id', protect, adminOnly, deleteDepartment);

module.exports = router; 