const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const { auth } = require('../middleware/authMiddleware');

// Webhooks don't usually use standard auth headers
router.post('/slack/webhook', integrationController.slackWebhook);
router.post('/github/webhook', integrationController.githubWebhook);

// Settings routes require auth
router.get('/settings/:orgId', auth, integrationController.getSettings);
router.post('/link/:orgId', auth, integrationController.linkService);
router.delete('/unlink/:orgId/:serviceName', auth, integrationController.unlinkService);

module.exports = router;
