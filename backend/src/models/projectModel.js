const db = require('../db');
const { randomUUID } = require('crypto');

const Project = {
  create: async ({ organization_id, name, description }) => {
    const id = randomUUID();
    await db.run(
      `INSERT INTO projects (id, organization_id, name, description) VALUES (?, ?, ?, ?)`,
      [id, organization_id, name, description || '']
    );
    return { id, organization_id, name, description };
  },

  findAllByOrg: async (orgId) => {
    return await db.query(`SELECT * FROM projects WHERE organization_id = ?`, [orgId]);
  },

  findById: async (id) => {
    const row = await db.get(`SELECT * FROM projects WHERE id = ?`, [id]);
    return row || null;
  }
};

module.exports = Project;