const Automation = require('../models/automationModel');
const db = require('../db');

const automationController = {
  list: async (req, res) => {
    try {
      const { slug } = req.params;
      // Get org id from slug (need orgModel)
      const org = await db.query(`SELECT id FROM organizations WHERE slug = '${slug}'`);
      if (!org.length) return res.status(404).json({ error: 'Org not found' });
      
      const rules = await Automation.findByOrg(org[0].id);
      res.json(rules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { slug } = req.params;
      const { trigger_type, action_type, config } = req.body;
      const org = await db.query(`SELECT id FROM organizations WHERE slug = '${slug}'`);
      if (!org.length) return res.status(404).json({ error: 'Org not found' });

      const rule = await Automation.create({
        org_id: org[0].id,
        trigger_type,
        action_type,
        config
      });
      res.status(201).json(rule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      await Automation.update(id, req.body);
      res.json({ message: 'Automation rule updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Automation.delete(id);
      res.json({ message: 'Automation rule deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = automationController;
