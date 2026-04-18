const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadProof, getProofsByEvent, approveProof } = require('../controllers/proof.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'backend/uploads'));
  },
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, safeName);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', protect, authorize('student'), upload.single('file'), uploadProof);
router.get('/event/:eventId', protect, authorize('brand'), getProofsByEvent);
router.patch('/:id/approve', protect, authorize('brand'), approveProof);

module.exports = router;
