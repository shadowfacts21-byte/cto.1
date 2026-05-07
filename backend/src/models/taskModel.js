const db = require('../db');
const { randomUUID } = require('crypto');

const Task = {
  create: async ({ project_id, title, description, status = 'todo', priority = 'medium', assigned_to = null }) => {
    const id = randomUUID();
    await db.run(
      `INSERT INTO app_tasks (id, project_id, title, description, status, priority, assigned_to)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, project_id, title, description || '', status, priority, assigned_to]
    );
    return { id, project_id, title, description, status, priority, assigned_to };
  },

  findAllByProject: async (projectId) => {
    return await db.query(`SELECT * FROM app_tasks WHERE project_id = ?`, [projectId]);
  },

  findById: async (id) => {
    const row = await db.get(`SELECT * FROM app_tasks WHERE id = ?`, [id]);
    return row || null;
  },

  update: async (id, updates) => {
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'assigned_to', 'due_date'];
    const entries = Object.entries(updates).filter(([key]) => allowedUpdates.includes(key));
    if (entries.length === 0) return null;

    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, value]) => value);

    await db.run(`UPDATE app_tasks SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [...values, id]);
    return await Task.findById(id);
  },

  delete: async (id) => {
    await db.run(`DELETE FROM app_tasks WHERE id = ?`, [id]);
  },

  addComment: async ({ task_id, user_id, content }) => {
    const id = randomUUID();
    await db.run(
      `INSERT INTO task_comments (id, task_id, user_id, content) VALUES (?, ?, ?, ?)`,
      [id, task_id, user_id, content]
    );
    return { id, task_id, user_id, content };
  },

  getComments: async (taskId) => {
    return await db.query(
      `SELECT tc.*, u.name as user_name FROM task_comments tc
       JOIN users u ON tc.user_id = u.id WHERE tc.task_id = ?
       ORDER BY tc.created_at ASC`,
      [taskId]
    );
  },

  logActivity: async ({ task_id, user_id, action }) => {
    const id = randomUUID();
    await db.run(
      `INSERT INTO task_activity (id, task_id, user_id, action) VALUES (?, ?, ?, ?)`,
      [id, task_id, user_id, action]
    );
  },

  getActivity: async (taskId) => {
    return await db.query(
      `SELECT ta.*, u.name as user_name FROM task_activity ta
       JOIN users u ON ta.user_id = u.id WHERE ta.task_id = ?
       ORDER BY ta.created_at DESC`,
      [taskId]
    );
  }
};

module.exports = Task;