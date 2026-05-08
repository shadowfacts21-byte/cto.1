const db = require('../db');
const { randomUUID } = require('crypto');

const escape = (str) => (str ? String(str).replace(/'/g, "''") : '');

const Subscription = {
  create: async ({ user_id, stripe_customer_id, plan, status, current_period_end }) => {
    const id = randomUUID();
    const period_end = current_period_end ? `'${escape(current_period_end)}'` : 'NULL';
    await db.query(`INSERT INTO subscriptions (id, user_id, stripe_customer_id, plan, status, current_period_end) VALUES ('${id}', '${escape(user_id)}', '${escape(stripe_customer_id)}', '${escape(plan)}', '${escape(status)}', ${period_end})`);
    return { id, user_id, stripe_customer_id, plan, status, current_period_end };
  },

  findByUserId: async (user_id) => {
    const subs = await db.query(`SELECT * FROM subscriptions WHERE user_id = '${escape(user_id)}' ORDER BY created_at DESC LIMIT 1`);
    return subs[0] || null;
  },

  update: async (user_id, { plan, status, current_period_end }) => {
    let sets = [];
    if (plan) sets.push(`plan = '${escape(plan)}'`);
    if (status) sets.push(`status = '${escape(status)}'`);
    if (current_period_end) sets.push(`current_period_end = '${escape(current_period_end)}'`);
    sets.push('updated_at = CURRENT_TIMESTAMP');

    await db.query(`UPDATE subscriptions SET ${sets.join(', ')} WHERE user_id = '${escape(user_id)}'`);
    return Subscription.findByUserId(user_id);
  }
};

module.exports = Subscription;
