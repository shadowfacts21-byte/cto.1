const db = require('../db');
const { randomUUID } = require('crypto');

const escape = (str) => str.replace(/'/g, "''");

const Organization = {
  create: async ({ name, slug, userId }) => {
    const id = randomUUID();
    await db.query(`INSERT INTO organizations (id, name, slug) VALUES ('${id}', '${escape(name)}', '${escape(slug)}')`);
    await db.query(`INSERT INTO organization_members (organization_id, user_id, role) VALUES ('${id}', '${userId}', 'admin')`);
    return { id, name, slug };
  },

  findAllByUser: async (userId) => {
    return await db.query(`
      SELECT o.* FROM organizations o
      JOIN organization_members om ON o.id = om.organization_id
      WHERE om.user_id = '${userId}'
    `);
  },

  findBySlug: async (slug) => {
    const orgs = await db.query(`SELECT * FROM organizations WHERE slug = '${escape(slug)}'`);
    return orgs[0] || null;
  },

  getMember: async (orgId, userId) => {
    const members = await db.query(`SELECT * FROM organization_members WHERE organization_id = '${orgId}' AND user_id = '${userId}'`);
    return members[0] || null;
  }
};

module.exports = Organization;
