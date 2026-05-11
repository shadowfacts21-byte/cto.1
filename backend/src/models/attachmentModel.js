const db = require('../db');
const { randomUUID } = require('crypto');

const Attachment = {
  create: async ({ task_id, file_name, file_path, file_type, uploaded_by }) => {
    const id = randomUUID();
    await db.query(`
      INSERT INTO app_attachments (id, task_id, file_name, file_path, file_type, uploaded_by)
      VALUES ('${id}', '${task_id}', '${file_name}', '${file_path}', '${file_type}', '${uploaded_by}')
    `);
    return { id, task_id, file_name, file_path, file_type, uploaded_by };
  },

  findByTask: async (taskId) => {
    return await db.query(`
      SELECT a.*, u.name as uploaded_by_name 
      FROM app_attachments a 
      JOIN users u ON a.uploaded_by = u.id 
      WHERE a.task_id = '${taskId}' 
      ORDER BY a.uploaded_at DESC
    `);
  },

  findById: async (id) => {
    const results = await db.query(`SELECT * FROM app_attachments WHERE id = '${id}'`);
    return results[0] || null;
  },

  delete: async (id) => {
    await db.query(`DELETE FROM app_attachments WHERE id = '${id}'`);
  }
};

module.exports = Attachment;
