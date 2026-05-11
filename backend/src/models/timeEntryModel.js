const db = require('../db');
const { randomUUID } = require('crypto');

const escape = (str) => (str ? String(str).replace(/'/g, "''") : '');

const TimeEntry = {
  create: async ({ task_id, user_id, start_time, notes = '' }) => {
    const id = randomUUID();
    await db.query(`
      INSERT INTO app_time_entries (id, task_id, user_id, start_time, notes)
      VALUES ('${id}', '${task_id}', '${user_id}', '${start_time}', '${escape(notes)}')
    `);
    return { id, task_id, user_id, start_time, notes };
  },

  stop: async (id, end_time) => {
    // Calculate duration
    const entry = await db.query(`SELECT start_time FROM app_time_entries WHERE id = '${id}'`);
    if (!entry.length) throw new Error('Time entry not found');
    
    const startTime = new Date(entry[0].start_time);
    const endTime = new Date(end_time);
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
    
    await db.query(`
      UPDATE app_time_entries 
      SET end_time = '${end_time}', duration_minutes = ${durationMinutes} 
      WHERE id = '${id}'
    `);
    
    return { id, end_time, duration_minutes: durationMinutes };
  },

  findByTask: async (taskId) => {
    return await db.query(`
      SELECT te.*, u.name as user_name 
      FROM app_time_entries te 
      JOIN users u ON te.user_id = u.id 
      WHERE te.task_id = '${taskId}' 
      ORDER BY te.start_time DESC
    `);
  },

  getTotalByTask: async (taskId) => {
    const result = await db.query(`
      SELECT SUM(duration_minutes) as total_minutes 
      FROM app_time_entries 
      WHERE task_id = '${taskId}'
    `);
    return result[0].total_minutes || 0;
  },

  getTotalByProject: async (projectId) => {
    const result = await db.query(`
      SELECT SUM(te.duration_minutes) as total_minutes 
      FROM app_time_entries te
      JOIN app_tasks t ON te.task_id = t.id
      WHERE t.project_id = '${projectId}'
    `);
    return result[0].total_minutes || 0;
  },

  getTotalByUser: async (userId) => {
    const result = await db.query(`
      SELECT SUM(duration_minutes) as total_minutes 
      FROM app_time_entries 
      WHERE user_id = '${userId}'
    `);
    return result[0].total_minutes || 0;
  },

  getAggregatedReport: async (projectId) => {
    return await db.query(`
      SELECT u.name as user_name, SUM(te.duration_minutes) as total_minutes
      FROM app_time_entries te
      JOIN app_tasks t ON te.task_id = t.id
      JOIN users u ON te.user_id = u.id
      WHERE t.project_id = '${projectId}'
      GROUP BY u.id
    `);
  }
};

module.exports = TimeEntry;
