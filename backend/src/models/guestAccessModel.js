const db = require('../db');
const { randomUUID, randomBytes } = require('crypto');

const GuestAccess = {
  invite: async ({ org_id, email, project_id, access_level = 'viewer', expires_in_days = 7 }) => {
    const id = randomUUID();
    const token = randomBytes(32).toString('hex');
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + expires_in_days);

    await db.query(`
      INSERT INTO app_guest_access (id, org_id, email, project_id, access_level, token, expires_at)
      VALUES ('${id}', '${org_id}', '${email}', '${project_id}', '${access_level}', '${token}', '${expires_at.toISOString()}')
    `);
    return { id, email, token, expires_at };
  },

  findByToken: async (token) => {
    const results = await db.query(`
      SELECT * FROM app_guest_access 
      WHERE token = '${token}' AND expires_at > CURRENT_TIMESTAMP
    `);
    return results[0] || null;
  },

  listByProject: async (projectId) => {
    return await db.query(`SELECT * FROM app_guest_access WHERE project_id = '${projectId}'`);
  },

  revoke: async (id) => {
    await db.query(`DELETE FROM app_guest_access WHERE id = '${id}'`);
  }
};

module.exports = GuestAccess;
