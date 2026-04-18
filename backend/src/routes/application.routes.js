const express = require('express');
const {
  createApplication,
  getMyApplications,
  respondApplication,
} = require('../controllers/application.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

router.post('/', protect, authorize('student', 'brand'), createApplication);
router.get('/mine', protect, authorize('student', 'brand'), getMyApplications);
router.patch('/:id/respond', protect, authorize('student', 'brand'), respondApplication);

module.exports = router;
