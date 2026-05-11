const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);

router.get('/project/:id', analyticsController.getProjectAnalytics);
router.get('/user/:id', analyticsController.getUserAnalytics);
router.get('/org/:orgId', analyticsController.getOrgAnalytics);

module.exports = router;
