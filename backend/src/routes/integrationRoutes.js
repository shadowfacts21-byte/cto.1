const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const authMiddleware = require('../middleware/authMiddleware');

// Webhooks don't usually use standard auth headers
router.post('/slack/webhook', integrationController.slackWebhook);
router.post('/github/webhook', integrationController.githubWebhook);

// Settings routes require auth
router.get('/settings/:orgId', authMiddleware, integrationController.getSettings);
router.post('/link/:orgId', authMiddleware, integrationController.linkService);
router.delete('/unlink/:orgId/:serviceName', authMiddleware, integrationController.unlinkService);

module.exports = router;