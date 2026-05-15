const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Mock plans for demo - in production these would come from a database
const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: ['3 projects', '5 team members', 'Basic analytics', '1GB storage'],
    limits: { projects: 3, members: 5, storage: 1 }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    features: ['Unlimited projects', '20 team members', 'Advanced analytics', '50GB storage', 'Priority support', 'Custom integrations'],
    limits: { projects: -1, members: 20, storage: 50 }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    features: ['Unlimited everything', 'Advanced security', 'SSO/SAML', 'Dedicated support', 'Custom SLA', 'On-premise option'],
    limits: { projects: -1, members: -1, storage: 500 }
  }
};

// Get current plan and usage
router.get('/plan', protect, (req, res) => {
  // In production, fetch from database based on user/org subscription
  const userPlan = req.user.plan || 'free';
  const plan = PLANS[userPlan] || PLANS.free;
  
  res.json(plan);
});

router.get('/usage', protect, (req, res) => {
  // In production, calculate actual usage from database
  const usage = {
    projects: 5,
    projectsLimit: PLANS[req.user.plan || 'free'].limits.projects,
    members: 3,
    membersLimit: PLANS[req.user.plan || 'free'].limits.members,
    storage: 2.5,
    storageLimit: PLANS[req.user.plan || 'free'].limits.storage
  };
  
  res.json(usage);
});

// Get all available plans
router.get('/plans', (req, res) => {
  res.json(Object.values(PLANS));
});

// Create checkout session (Stripe integration placeholder)
router.post('/checkout', protect, async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = PLANS[planId];
    
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    // In production with Stripe:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   payment_method_types: ['card'],
    //   line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    //   success_url: `${process.env.FRONTEND_URL}/settings?billing=success`,
    //   cancel_url: `${process.env.FRONTEND_URL}/settings?billing=cancelled`,
    // });
    
    // Mock response for demo
    res.json({
      success: true,
      message: 'Checkout session created',
      planId,
      // sessionId: session.id, // In production
      // url: session.url // In production
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Cancel subscription
router.post('/cancel', protect, (req, res) => {
  // In production with Stripe:
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // await stripe.subscriptions.del(user.subscriptionId);
  
  res.json({ success: true, message: 'Subscription cancelled' });
});

// Stripe webhook handler
router.post('/webhook', (req, res) => {
  // In production with Stripe:
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // const sig = req.headers['stripe-signature'];
  // 
  // try {
  //   const event = stripe.webhooks.constructEvent(
  //     req.body, sig, process.env.STRIPE_WEBHOOK_SECRET
  //   );
  //   
  //   switch (event.type) {
  //     case 'checkout.session.completed':
  //       // Handle subscription creation
  //       break;
  //     case 'customer.subscription.updated':
  //       // Handle subscription update
  //       break;
  //     case 'customer.subscription.deleted':
  //       // Handle subscription cancellation
  //       break;
  //   }
  // } catch (err) {
  //   return res.status(400).send(`Webhook Error: ${err.message}`);
  // }
  
  res.json({ received: true });
});

module.exports = router;