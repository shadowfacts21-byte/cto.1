const db = require('../db');
const { randomUUID } = require('crypto');

const escape = (str) => (str ? str.replace(/'/g, "''") : '');

const User = {
  create: async ({ email, passwordHash, name, plan = 'free' }) => {
    const id = randomUUID();
    await db.query(`INSERT INTO users (id, email, password_hash, name, plan) VALUES ('${id}', '${escape(email)}', '${passwordHash}', '${escape(name)}', '${escape(plan)}')`);
    return { id, email, name, plan };
  },

  findByEmail: async (email) => {
    const users = await db.query(`SELECT * FROM users WHERE email = '${escape(email)}'`);
    return users[0] || null;
  },

  findById: async (id) => {
    const users = await db.query(`SELECT id, email, name, plan, created_at FROM users WHERE id = '${escape(id)}'`);
    return users[0] || null;
  },

  updatePlan: async (id, plan) => {
    await db.query(`UPDATE users SET plan = '${escape(plan)}', updated_at = CURRENT_TIMESTAMP WHERE id = '${escape(id)}'`);
    return { id, plan };
  }
};

module.exports = User;
