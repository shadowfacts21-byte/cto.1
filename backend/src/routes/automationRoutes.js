const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/:slug/automations', automationController.list);
router.post('/:slug/automations', automationController.create);
router.patch('/automations/:id', automationController.update);
router.delete('/automations/:id', automationController.delete);

module.exports = router;
