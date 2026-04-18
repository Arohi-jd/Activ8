const express = require('express');
const {
  createCollege,
  listColleges,
  verifyCollege,
  pendingStudents,
  approveStudent,
} = require('../controllers/college.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

router.post('/', protect, authorize('college_admin'), createCollege);
router.get('/', protect, authorize('platform_admin'), listColleges);
router.patch('/:id/verify', protect, authorize('platform_admin'), verifyCollege);
router.get('/students/pending', protect, authorize('college_admin'), pendingStudents);
router.patch('/students/:id/approve', protect, authorize('college_admin'), approveStudent);

module.exports = router;
