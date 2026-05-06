const Project = require('../models/projectModel');
const Organization = require('../models/orgModel');

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { slug } = req.params;

    const org = await Organization.findBySlug(slug);
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const member = await Organization.getMember(org.id, req.user.id);
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create projects' });
    }

    const project = await Project.create({ organization_id: org.id, name, description });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listProjects = async (req, res) => {
  try {
    const { slug } = req.params;
    const org = await Organization.findBySlug(slug);
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const member = await Organization.getMember(org.id, req.user.id);
    if (!member) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const projects = await Project.findAllByOrg(org.id);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const member = await Organization.getMember(project.organization_id, req.user.id);
    if (!member) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
