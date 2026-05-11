const Analytics = require('../models/analyticsModel');

const analyticsController = {
  getProjectAnalytics: async (req, res) => {
    try {
      const { id } = req.params;
      const metrics = await Analytics.getProjectMetrics(id);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserAnalytics: async (req, res) => {
    try {
      const { id } = req.params;
      const metrics = await Analytics.getUserMetrics(id);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOrgAnalytics: async (req, res) => {
    try {
      const { orgId } = req.params;
      const metrics = await Analytics.getGlobalMetrics(orgId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = analyticsController;
