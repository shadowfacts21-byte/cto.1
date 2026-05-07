const db = require('../db');
const { randomUUID } = require('crypto');

const User = {
  create: async ({ email, passwordHash, name }) => {
    const id = randomUUID();
    await db.run(
      `INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)`,
      [id, email, passwordHash, name]
    );
    return { id, email, name };
  },

  findByEmail: async (email) => {
    const row = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    return row || null;
  },

  findById: async (id) => {
    const row = await db.get(
      `SELECT id, email, name, created_at FROM users WHERE id = ?`,
      [id]
    );
    return row || null;
  }
};

module.exports = User;