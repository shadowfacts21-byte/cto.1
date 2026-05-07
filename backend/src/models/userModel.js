const db = require('../db');
const { randomUUID } = require('crypto');

const escape = (str) => str.replace(/'/g, "''");

const User = {
  create: async ({ email, passwordHash, name }) => {
    const id = randomUUID();
    await db.query(`INSERT INTO users (id, email, password_hash, name) VALUES ('${id}', '${escape(email)}', '${passwordHash}', '${escape(name)}')`);
    return { id, email, name };
  },

  findByEmail: async (email) => {
    const users = await db.query(`SELECT * FROM users WHERE email = '${escape(email)}'`);
    return users[0] || null;
  },

  findById: async (id) => {
    const users = await db.query(`SELECT id, email, name, created_at FROM users WHERE id = '${escape(id)}'`);
    return users[0] || null;
  }
};

module.exports = User;
