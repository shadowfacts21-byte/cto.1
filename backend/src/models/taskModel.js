const db = require('../db');
const { randomUUID } = require('crypto');

const escape = (str) => (str ? String(str).replace(/'/g, "''") : '');

const Task = {
  create: async ({ project_id, title, description, status = 'todo', priority = 'medium', assigned_to = null }) => {
    const id = randomUUID();
    await db.query(`
      INSERT INTO app_tasks (id, project_id, title, description, status, priority, assigned_to)
      VALUES ('${id}', '${project_id}', '${escape(title)}', '${escape(description)}', '${status}', '${priority}', ${assigned_to ? `'${assigned_to}'` : 'NULL'})
    `);
    return { id, project_id, title, description, status, priority, assigned_to };
  },

  findAllByProject: async (projectId) => {
    return await db.query(`SELECT * FROM app_tasks WHERE project_id = '${projectId}'`);
  },

  findById: async (id) => {
    const tasks = await db.query(`SELECT * FROM app_tasks WHERE id = '${id}'`);
    return tasks[0] || null;
  },

  update: async (id, updates) => {
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'assigned_to', 'due_date'];
    const setClause = Object.entries(updates)
      .filter(([key]) => allowedUpdates.includes(key))
      .map(([key, value]) => `${key} = ${value === null ? 'NULL' : `'${escape(value.toString())}'`}`)
      .join(', ');

    if (!setClause) return null;

    await db.query(`UPDATE app_tasks SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = '${id}'`);
    return await Task.findById(id);
  },

  delete: async (id) => {
    await db.query(`DELETE FROM app_tasks WHERE id = '${id}'`);
  },

  addComment: async ({ task_id, user_id, content }) => {
    const id = randomUUID();
    await db.query(`INSERT INTO app_task_comments (id, task_id, user_id, content) VALUES ('${id}', '${task_id}', '${user_id}', '${escape(content)}')`);
    return { id, task_id, user_id, content };
  },

  getComments: async (taskId) => {
    return await db.query(`SELECT tc.*, u.name as user_name FROM app_task_comments tc JOIN users u ON tc.user_id = u.id WHERE tc.task_id = '${taskId}' ORDER BY tc.created_at ASC`);
  },

  logActivity: async ({ task_id, user_id, action, details }) => {
    const id = randomUUID();
    await db.query(`INSERT INTO app_task_activity (id, task_id, user_id, action, details) VALUES ('${id}', '${task_id}', '${user_id}', '${action}', '${escape(details)}')`);
  },

  getActivity: async (taskId) => {
    return await db.query(`SELECT ta.*, u.name as user_name FROM app_task_activity ta JOIN users u ON ta.user_id = u.id WHERE ta.task_id = '${taskId}' ORDER BY ta.created_at DESC`);
  }
};

module.exports = Task;
