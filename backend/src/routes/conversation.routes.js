const express = require('express');
const { getConversation, sendMessage, getMessages } = require('../controllers/conversation.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/:applicationId', protect, authorize('student', 'brand'), getConversation);
router.post('/:id/messages', protect, authorize('student', 'brand'), sendMessage);
router.get('/:id/messages', protect, authorize('student', 'brand'), getMessages);

module.exports = router;
