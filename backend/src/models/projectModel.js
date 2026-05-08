const db = require('../db');
const { randomUUID } = require('crypto');

const escape = (str) => (str ? String(str).replace(/'/g, "''") : '');

const Project = {
  create: async ({ organization_id, name, description = '' }) => {
    const id = randomUUID();
    await db.query(`INSERT INTO projects (id, organization_id, name, description) VALUES ('${id}', '${organization_id}', '${escape(name)}', '${escape(description)}')`);
    return { id, organization_id, name, description };
  },

  findAllByOrg: async (orgId) => {
    return await db.query(`SELECT * FROM projects WHERE organization_id = '${orgId}'`);
  },

  findById: async (id) => {
    const projects = await db.query(`SELECT * FROM projects WHERE id = '${id}'`);
    return projects[0] || null;
  }
};

module.exports = Project;
