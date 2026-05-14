const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/settings', notificationController.getSettings);
router.patch('/settings', notificationController.updateSettings);

module.exports = router;
