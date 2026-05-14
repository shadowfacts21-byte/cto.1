const db = require('../db');
const { randomUUID, randomBytes } = require('crypto');

const escape = (str) => (str ? String(str).replace(/'/g, "''") : '');

const Invite = {
  create: async ({ org_id, email, role = 'member', expires_in_days = 7 }) => {
    const id = randomUUID();
    const token = randomBytes(32).toString('hex');
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + expires_in_days);

    await db.query(`
      INSERT INTO app_org_invites (id, org_id, email, role, token, expires_at)
      VALUES ('${id}', '${org_id}', '${escape(email)}', '${role}', '${token}', '${expires_at.toISOString()}')
    `);
    return { id, email, token, expires_at };
  },

  findByToken: async (token) => {
    const results = await db.query(`
      SELECT * FROM app_org_invites 
      WHERE token = '${escape(token)}' AND expires_at > CURRENT_TIMESTAMP
    `);
    return results[0] || null;
  },

  delete: async (id) => {
    await db.query(`DELETE FROM app_org_invites WHERE id = '${id}'`);
  }
};

module.exports = Invite;
