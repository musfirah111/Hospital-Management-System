const express = require('express');
const router = express.Router();
const {
    addDepartment,
    updateDepartment,
    deleteDepartment,
    getAllDepartments
} = require('../controllers/departmentController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

router.get('/', protect, getAllDepartments);
router.post('/', protect, adminOnly, addDepartment);
router.put('/:id', protect, adminOnly, updateDepartment);
router.delete('/:id', protect, adminOnly, deleteDepartment);

module.exports = router; 