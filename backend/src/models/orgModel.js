const db = require('../db');
const { randomUUID } = require('crypto');

const escape = (str) => (str ? String(str).replace(/'/g, "''") : '');

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
  getMembers: async (orgId) => {
    return await db.query(`
      SELECT u.id, u.email, u.name, om.role, om.joined_at 
      FROM users u
      JOIN organization_members om ON u.id = om.user_id
      WHERE om.organization_id = '${orgId}'
    `);
  },
  getMember: async (orgId, userId) => {
    const members = await db.query(`SELECT * FROM organization_members WHERE organization_id = '${orgId}' AND user_id = '${userId}'`);
    return members[0] || null;
  },
  addMember: async (orgId, userId, role = 'member') => {
    await db.query(`INSERT INTO organization_members (organization_id, user_id, role) VALUES ('${orgId}', '${userId}', '${role}')`);
    return { organization_id: orgId, user_id: userId, role };
  },
  removeMember: async (orgId, userId) => {
    await db.query(`DELETE FROM organization_members WHERE organization_id = '${orgId}' AND user_id = '${userId}'`);
  }
};

module.exports = Organization;
