const Organization = require('../models/orgModel');

exports.createOrg = async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const existing = await Organization.findBySlug(slug);
    if (existing) {
      return res.status(400).json({ error: 'Slug already taken' });
    }

    const org = await Organization.create({ name, slug, userId: req.user.id });
    res.status(201).json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listOrgs = async (req, res) => {
  try {
    const orgs = await Organization.findAllByUser(req.user.id);
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrg = async (req, res) => {
  try {
    const org = await Organization.findBySlug(req.params.slug);
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const member = await Organization.getMember(org.id, req.user.id);
    if (!member) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
