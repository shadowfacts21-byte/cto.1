const db = require('../db');

const Analytics = {
  getProjectMetrics: async (projectId) => {
    // Task completion status counts
    const statusCounts = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM app_tasks 
      WHERE project_id = '${projectId}'
      GROUP BY status
    `);

    // Priority counts
    const priorityCounts = await db.query(`
      SELECT priority, COUNT(*) as count 
      FROM app_tasks 
      WHERE project_id = '${projectId}'
      GROUP BY priority
    `);

    // Completion rate over last 30 days
    const completionOverTime = await db.query(`
      SELECT date(created_at) as date, COUNT(*) as count
      FROM app_task_activity
      WHERE action = 'status_changed' AND details LIKE '%to done%'
      AND task_id IN (SELECT id FROM app_tasks WHERE project_id = '${projectId}')
      AND created_at >= date('now', '-30 days')
      GROUP BY date(created_at)
    `);

    return {
      statusCounts,
      priorityCounts,
      completionOverTime
    };
  },

  getUserMetrics: async (userId) => {
    // Tasks assigned vs completed
    const taskStats = await db.query(`
      SELECT 
        COUNT(*) as total_assigned,
        SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed
      FROM app_tasks
      WHERE assigned_to = '${userId}'
    `);

    // Activity counts by type
    const activityStats = await db.query(`
      SELECT action, COUNT(*) as count
      FROM app_task_activity
      WHERE user_id = '${userId}'
      GROUP BY action
    `);

    return {
      taskStats: taskStats[0],
      activityStats
    };
  },

  getGlobalMetrics: async (orgId) => {
    // Projects in org
    const projects = await db.query(`SELECT id, name FROM projects WHERE organization_id = '${orgId}'`);
    
    const projectStats = [];
    for (const project of projects) {
      const stats = await db.query(`
        SELECT status, COUNT(*) as count 
        FROM app_tasks 
        WHERE project_id = '${project.id}'
        GROUP BY status
      `);
      projectStats.push({
        projectId: project.id,
        projectName: project.name,
        stats
      });
    }

    return projectStats;
  }
};

module.exports = Analytics;
