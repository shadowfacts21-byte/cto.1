const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const subscription = await Subscription.findByUserId(req.user.id);
    res.json({
      plan: user.plan,
      subscription
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    const priceId = process.env[`STRIPE_PRICE_${plan.toUpperCase()}`];
    
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid plan or missing price ID' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/billing`,
      customer_email: req.user.email,
      metadata: { userId: req.user.id, plan }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, plan } = session.metadata;
    const stripeCustomerId = session.customer;
    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await User.updatePlan(userId, plan);
    await Subscription.create({
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
      plan,
      status: 'active',
      current_period_end: currentPeriodEnd
    });
  }

  res.json({ received: true });
};

exports.updatePlan = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['free', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    // Mock implementation for development if Stripe not configured
    if (!process.env.STRIPE_SECRET_KEY) {
        await User.updatePlan(req.user.id, plan);
        let subscription = await Subscription.findByUserId(req.user.id);
        if (subscription) {
          await Subscription.update(req.user.id, { plan, status: 'active' });
        } else {
          await Subscription.create({
            user_id: req.user.id,
            stripe_customer_id: 'cus_mock_' + req.user.id,
            plan,
            status: 'active',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
        return res.json({ message: `Plan updated to ${plan} (Mock)` });
    }

    // In production, we'd use Stripe Customer Portal or direct API calls
    res.status(501).json({ error: 'Real Stripe plan update not implemented, use checkout session' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByUserId(req.user.id);
    if (subscription && process.env.STRIPE_SECRET_KEY) {
      // Logic to cancel in Stripe would go here
    }
    
    await User.updatePlan(req.user.id, 'free');
    await Subscription.update(req.user.id, { status: 'canceled' });
    res.json({ message: 'Subscription canceled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
