const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const attachmentController = require('../controllers/attachmentController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.use(authMiddleware);

router.post('/tasks/:id/attachments', upload.single('file'), attachmentController.upload);
router.get('/tasks/:id/attachments', attachmentController.list);
router.delete('/attachments/:attachmentId', attachmentController.delete);
router.get('/attachments/:attachmentId/download', attachmentController.download);

module.exports = router;
