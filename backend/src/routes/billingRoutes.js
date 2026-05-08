const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/plan', billingController.getPlan);
router.post('/upgrade', billingController.updatePlan);
router.post('/cancel', billingController.cancelSubscription);

module.exports = router;
