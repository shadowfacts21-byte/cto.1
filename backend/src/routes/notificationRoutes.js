const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);

router.get('/settings', notificationController.getSettings);
router.patch('/settings', notificationController.updateSettings);

module.exports = router;
