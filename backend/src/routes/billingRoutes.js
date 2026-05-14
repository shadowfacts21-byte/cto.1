const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { auth } = require('../middleware/authMiddleware');

// Webhook doesn't use auth middleware (Stripe signature verification instead)
// It also needs raw body
router.post('/webhook', express.raw({type: 'application/json'}), billingController.handleWebhook);

// Other routes need JSON parsing
router.use(express.json());

router.use(auth);

router.get('/plan', billingController.getPlan);
router.post('/upgrade', billingController.updatePlan);
router.post('/cancel', billingController.cancelSubscription);
router.post('/create-checkout-session', billingController.createCheckoutSession);

module.exports = router;
