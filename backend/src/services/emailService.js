const db = require('../db');

const emailService = {
  send: async ({ to, subject, body }) => {
    // Mocking email sending
    console.log(`[Email] Sending to ${to}: ${subject}`);
    // In a real app, use nodemailer or a service like SendGrid
    return true;
  },

  notifyTaskAssigned: async (taskId, userId) => {
    const settings = await emailService.getSettings(userId);
    if (!settings || !settings.email_on_assign) return;

    const user = await db.query(`SELECT email, name FROM users WHERE id = '${userId}'`);
    const task = await db.query(`SELECT title FROM app_tasks WHERE id = '${taskId}'`);
    
    if (user.length && task.length) {
      await emailService.send({
        to: user[0].email,
        subject: `New Task Assigned: ${task[0].title}`,
        body: `Hi ${user[0].name}, a new task has been assigned to you.`
      });
    }
  },

  notifyNewComment: async (taskId, commentUserId, content) => {
    const task = await db.query(`SELECT assigned_to, title FROM app_tasks WHERE id = '${taskId}'`);
    if (!task.length || !task[0].assigned_to) return;
    
    const userId = task[0].assigned_to;
    if (userId === commentUserId) return; // Don't notify own comments

    const settings = await emailService.getSettings(userId);
    if (!settings || !settings.email_on_comment) return;

    const user = await db.query(`SELECT email, name FROM users WHERE id = '${userId}'`);
    const commenter = await db.query(`SELECT name FROM users WHERE id = '${commentUserId}'`);
    
    if (user.length && commenter.length) {
      await emailService.send({
        to: user[0].email,
        subject: `New Comment on: ${task[0].title}`,
        body: `Hi ${user[0].name}, ${commenter[0].name} commented: ${content}`
      });
    }
  },

  getSettings: async (userId) => {
    const results = await db.query(`SELECT * FROM app_notification_settings WHERE user_id = '${userId}'`);
    if (!results.length) {
      // Return default settings
      return { email_on_assign: 1, email_on_comment: 1, email_on_status_change: 1 };
    }
    return results[0];
  },

  updateSettings: async (userId, settings) => {
    const { email_on_assign, email_on_comment, email_on_status_change } = settings;
    await db.query(`
      INSERT INTO app_notification_settings (user_id, email_on_assign, email_on_comment, email_on_status_change)
      VALUES ('${userId}', ${email_on_assign}, ${email_on_comment}, ${email_on_status_change})
      ON CONFLICT(user_id) DO UPDATE SET
        email_on_assign = excluded.email_on_assign,
        email_on_comment = excluded.email_on_comment,
        email_on_status_change = excluded.email_on_status_change
    `);
  }
};

module.exports = emailService;
