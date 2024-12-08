const express = require('express');
const router = express.Router();
const { 
    addDepartment, 
    updateDepartment, 
    deleteDepartment, 
    getAllDepartments, 
    updateDepartmentStatus 
} = require('../controllers/departmentController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

router.post('/', protect, adminOnly, addDepartment);
router.put('/:id', protect, adminOnly, updateDepartment);
router.delete('/:id', protect, adminOnly, deleteDepartment);
router.get('/', getAllDepartments);
router.put('/:id/status', protect, adminOnly, updateDepartmentStatus);

module.exports = router; 