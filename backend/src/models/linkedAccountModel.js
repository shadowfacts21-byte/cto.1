const db = require('../db');
const { randomUUID } = require('crypto');

const LinkedAccount = {
  link: async ({ org_id, service_name, external_id, access_token, config = {} }) => {
    const id = randomUUID();
    await db.query(`
      INSERT INTO app_linked_accounts (id, org_id, service_name, external_id, access_token, config)
      VALUES ('${id}', '${org_id}', '${service_name}', '${external_id}', '${access_token}', '${JSON.stringify(config).replace(/'/g, "''")}')
      ON CONFLICT(org_id, service_name) DO UPDATE SET
        external_id = excluded.external_id,
        access_token = excluded.access_token,
        config = excluded.config
    `);
    return { id, org_id, service_name, external_id, access_token, config };
  },

  findByOrg: async (orgId) => {
    const results = await db.query(`SELECT * FROM app_linked_accounts WHERE org_id = '${orgId}'`);
    return results.map(r => ({ ...r, config: JSON.parse(r.config || '{}') }));
  },

  findByService: async (orgId, serviceName) => {
    const results = await db.query(`SELECT * FROM app_linked_accounts WHERE org_id = '${orgId}' AND service_name = '${serviceName}'`);
    if (!results.length) return null;
    return { ...results[0], config: JSON.parse(results[0].config || '{}') };
  },

  unlink: async (orgId, serviceName) => {
    await db.query(`DELETE FROM app_linked_accounts WHERE org_id = '${orgId}' AND service_name = '${serviceName}'`);
  }
};

module.exports = LinkedAccount;
