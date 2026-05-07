const db = require('../db');
const { randomUUID } = require('crypto');

const Organization = {
  create: async ({ name, slug, userId }) => {
    const id = randomUUID();
    await db.run(
      `INSERT INTO organizations (id, name, slug) VALUES (?, ?, ?)`,
      [id, name, slug]
    );
    await db.run(
      `INSERT INTO organization_members (organization_id, user_id, role) VALUES (?, ?, 'admin')`,
      [id, userId]
    );
    return { id, name, slug };
  },

  findAllByUser: async (userId) => {
    return await db.query(
      `SELECT o.* FROM organizations o
       JOIN organization_members om ON o.id = om.organization_id
       WHERE om.user_id = ?`,
      [userId]
    );
  },

  findBySlug: async (slug) => {
    const row = await db.get(`SELECT * FROM organizations WHERE slug = ?`, [slug]);
    return row || null;
  },

  getMember: async (orgId, userId) => {
    const row = await db.get(
      `SELECT * FROM organization_members WHERE organization_id = ? AND user_id = ?`,
      [orgId, userId]
    );
    return row || null;
  }
};

module.exports = Organization;