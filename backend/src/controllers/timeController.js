const TimeEntry = require('../models/timeEntryModel');
const Task = require('../models/taskModel');
const db = require('../db');

const timeController = {
  listByTask: async (req, res) => {
    try {
      const { id } = req.params;
      const entries = await TimeEntry.findByTask(id);
      const totalMinutes = await TimeEntry.getTotalByTask(id);
      res.json({ entries, totalMinutes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  startTimer: async (req, res) => {
    try {
      const { id } = req.params; // task_id
      const { notes } = req.body;
      const user_id = req.user.id;
      const start_time = new Date().toISOString();
      
      const entry = await TimeEntry.create({ 
        task_id: id, 
        user_id, 
        start_time, 
        notes 
      });
      
      await Task.logActivity({
        task_id: id,
        user_id,
        action: 'timer_started',
        details: `Started timer at ${start_time}`
      });

      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  stopTimer: async (req, res) => {
    try {
      const { entryId } = req.params;
      const end_time = new Date().toISOString();
      
      const result = await TimeEntry.stop(entryId, end_time);
      
      // Get task_id for activity log
      const entries = await db.query(`SELECT task_id FROM app_time_entries WHERE id = '${entryId}'`);
      if (entries.length) {
        await Task.logActivity({
          task_id: entries[0].task_id,
          user_id: req.user.id,
          action: 'timer_stopped',
          details: `Stopped timer. Duration: ${result.duration_minutes} minutes`
        });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProjectReport: async (req, res) => {
    try {
      const { projectId } = req.params;
      const report = await TimeEntry.getAggregatedReport(projectId);
      const totalMinutes = await TimeEntry.getTotalByProject(projectId);
      res.json({ report, totalMinutes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserReport: async (req, res) => {
    try {
      const { userId } = req.params;
      const totalMinutes = await TimeEntry.getTotalByUser(userId);
      res.json({ userId, totalMinutes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = timeController;
