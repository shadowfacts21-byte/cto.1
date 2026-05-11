const db = require('../db');
const { randomUUID } = require('crypto');

const Automation = {
  create: async ({ org_id, trigger_type, action_type, config }) => {
    const id = randomUUID();
    await db.query(`
      INSERT INTO app_automation_rules (id, org_id, trigger_type, action_type, config)
      VALUES ('${id}', '${org_id}', '${trigger_type}', '${action_type}', '${JSON.stringify(config).replace(/'/g, "''")}')
    `);
    return { id, org_id, trigger_type, action_type, config };
  },

  findByOrg: async (orgId) => {
    const results = await db.query(`SELECT * FROM app_automation_rules WHERE org_id = '${orgId}'`);
    return results.map(r => ({ ...r, config: JSON.parse(r.config) }));
  },

  update: async (id, updates) => {
    const allowed = ['enabled', 'config', 'trigger_type', 'action_type'];
    const setClause = Object.entries(updates)
      .filter(([key]) => allowed.includes(key))
      .map(([key, value]) => `${key} = ${typeof value === 'object' ? `'${JSON.stringify(value).replace(/'/g, "''")}'` : (typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value)}`)
      .join(', ');
    
    if (!setClause) return null;
    await db.query(`UPDATE app_automation_rules SET ${setClause} WHERE id = '${id}'`);
    return true;
  },

  delete: async (id) => {
    await db.query(`DELETE FROM app_automation_rules WHERE id = '${id}'`);
  },

  findEnabledByTrigger: async (orgId, triggerType) => {
    const results = await db.query(`
      SELECT * FROM app_automation_rules 
      WHERE org_id = '${orgId}' AND trigger_type = '${triggerType}' AND enabled = 1
    `);
    return results.map(r => ({ ...r, config: JSON.parse(r.config) }));
  }
};

module.exports = Automation;
