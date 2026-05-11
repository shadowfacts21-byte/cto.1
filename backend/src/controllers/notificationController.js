const emailService = require('../services/emailService');

const notificationController = {
  getSettings: async (req, res) => {
    try {
      const settings = await emailService.getSettings(req.user.id);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateSettings: async (req, res) => {
    try {
      await emailService.updateSettings(req.user.id, req.body);
      res.json({ message: 'Notification settings updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = notificationController;
