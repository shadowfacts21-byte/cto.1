const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Organization = require('../models/orgModel');

const PLAN_LIMITS = {
  free: { maxProjects: 3 },
  pro: { maxProjects: 20 },
  enterprise: { maxProjects: 1000 }
};

exports.checkProjectLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const plan = user.plan || 'free';
    const limit = PLAN_LIMITS[plan].maxProjects;

    const { slug } = req.params;
    const org = await Organization.findBySlug(slug);
    
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const projects = await Project.findAllByOrg(org.id);
    if (projects.length >= limit) {
      return res.status(403).json({ 
        error: `Plan limit reached. Your '${plan}' plan allows a maximum of ${limit} projects per organization.`,
        limit,
        current: projects.length
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
