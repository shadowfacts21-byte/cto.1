const Automation = require('../models/automationModel');
const Task = require('../models/taskModel');

const automationService = {
  evaluate: async (orgId, triggerType, data) => {
    const rules = await Automation.findEnabledByTrigger(orgId, triggerType);
    
    for (const rule of rules) {
      try {
        await automationService.executeAction(rule, data);
      } catch (error) {
        console.error(`Error executing automation rule ${rule.id}:`, error.message);
      }
    }
  },

  executeAction: async (rule, data) => {
    const { action_type, config } = rule;
    const { task_id, user_id } = data;

    switch (action_type) {
      case 'send_email':
        // Mock email sending
        console.log(`[Automation] Sending email to ${config.to} with subject ${config.subject}`);
        break;
      case 'post_slack':
        // Mock Slack posting
        console.log(`[Automation] Posting to Slack channel ${config.channel}: ${config.message}`);
        break;
      case 'move_task':
        await Task.update(task_id, { status: config.target_status });
        await Task.logActivity({
          task_id,
          user_id: 'system',
          action: 'automation_executed',
          details: `Moved task to ${config.target_status} via automation rule`
        });
        break;
      default:
        console.warn(`Unknown action type: ${action_type}`);
    }
  }
};

module.exports = automationService;
