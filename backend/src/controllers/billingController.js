const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');

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

exports.updatePlan = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['free', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    await User.updatePlan(req.user.id, plan);
    
    // In a real app, this would involve Stripe
    // For now, we just update the user record and create/update a mock subscription
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

    res.json({ message: `Plan updated to ${plan}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    await User.updatePlan(req.user.id, 'free');
    await Subscription.update(req.user.id, { status: 'canceled' });
    res.json({ message: 'Subscription canceled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
