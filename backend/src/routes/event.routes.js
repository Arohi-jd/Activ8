const express = require('express');
const {
  createEvent,
  listEvents,
  getEvent,
  publishEvent,
  addTier,
  getTiers,
} = require('../controllers/event.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

router.post('/', protect, authorize('student'), createEvent);
router.get('/', protect, authorize('brand', 'student'), listEvents);
router.get('/:id', protect, authorize('brand', 'student'), getEvent);
router.patch('/:id/publish', protect, authorize('student'), publishEvent);
router.post('/:id/tiers', protect, authorize('student'), addTier);
router.get('/:id/tiers', protect, authorize('brand', 'student'), getTiers);

module.exports = router;
