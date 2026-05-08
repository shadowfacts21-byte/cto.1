const Task = require('../models/taskModel');
const Project = require('../models/projectModel');
const Organization = require('../models/orgModel');

const checkAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const member = await Organization.getMember(project.organization_id, userId);
  return member;
};

exports.createTask = async (req, res) => {
  try {
    const { project_id, title, description, status, priority, assigned_to } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    if (!project_id) return res.status(400).json({ error: 'project_id is required' });

    const member = await checkAccess(project_id, req.user.id);
    if (!member) return res.status(403).json({ error: 'Access denied' });

    const task = await Task.create({ project_id, title, description, status, priority, assigned_to });
    await Task.logActivity({ task_id: task.id, user_id: req.user.id, action: 'created', details: `Task "${title}" created` });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const member = await checkAccess(task.project_id, req.user.id);
    if (!member) return res.status(403).json({ error: 'Access denied' });

    await Task.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listTasks = async (req, res) => {
  try {
    const { project_id } = req.query;
    if (!project_id) return res.status(400).json({ error: 'project_id is required' });

    const member = await checkAccess(project_id, req.user.id);
    if (!member) return res.status(403).json({ error: 'Access denied' });

    const tasks = await Task.findAllByProject(project_id);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const member = await checkAccess(task.project_id, req.user.id);
    if (!member) return res.status(403).json({ error: 'Access denied' });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const member = await checkAccess(task.project_id, req.user.id);
    if (!member) return res.status(403).json({ error: 'Access denied' });

    const updatedTask = await Task.update(req.params.id, req.body);
    await Task.logActivity({ 
      task_id: task.id, 
      user_id: req.user.id, 
      action: 'updated', 
      details: JSON.stringify(req.body) 
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const member = await checkAccess(task.project_id, req.user.id);
    if (!member) return res.status(403).json({ error: 'Access denied' });

    const comment = await Task.addComment({ task_id: task.id, user_id: req.user.id, content: req.body.content });
    await Task.logActivity({ task_id: task.id, user_id: req.user.id, action: 'commented', details: 'Added a comment' });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Task.getComments(req.params.id);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActivity = async (req, res) => {
  try {
    const activity = await Task.getActivity(req.params.id);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
