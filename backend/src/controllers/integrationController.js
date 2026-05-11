const LinkedAccount = require('../models/linkedAccountModel');
const Task = require('../models/taskModel');
const db = require('../db');

const integrationController = {
  slackWebhook: async (req, res) => {
    try {
      // In a real app, this would receive events from Slack
      // For now, it's a placeholder for outgoing task updates to Slack
      const { taskId, channel, message } = req.body;
      console.log(`[Slack] Posting to ${channel}: ${message} (Task: ${taskId})`);
      res.json({ status: 'ok' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  githubWebhook: async (req, res) => {
    try {
      const event = req.headers['x-github-event'];
      const payload = req.body;

      if (event === 'push') {
        // Link commits to tasks by looking for task IDs in commit messages
        for (const commit of payload.commits) {
          const match = commit.message.match(/TASK-([a-f0-9-]+)/i);
          if (match) {
            const taskId = match[1];
            await Task.logActivity({
              task_id: taskId,
              user_id: 'github-bot',
              action: 'github_commit',
              details: `Commit: ${commit.id.substring(0, 7)} - ${commit.message} by ${commit.author.name}`
            });
          }
        }
      }

      res.json({ status: 'ok' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSettings: async (req, res) => {
    try {
      const { orgId } = req.params;
      const accounts = await LinkedAccount.findByOrg(orgId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  linkService: async (req, res) => {
    try {
      const { orgId } = req.params;
      const { service_name, external_id, access_token, config } = req.body;
      const account = await LinkedAccount.link({
        org_id: orgId,
        service_name,
        external_id,
        access_token,
        config
      });
      res.status(201).json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  unlinkService: async (req, res) => {
    try {
      const { orgId, serviceName } = req.params;
      await LinkedAccount.unlink(orgId, serviceName);
      res.json({ message: `${serviceName} unlinked` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = integrationController;
