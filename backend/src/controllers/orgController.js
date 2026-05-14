const Organization = require('../models/orgModel');
const Invite = require('../models/inviteModel');
const User = require('../models/userModel');
const emailService = require('../services/emailService');

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

exports.listMembers = async (req, res) => {
  try {
    const { slug } = req.params;
    const org = await Organization.findBySlug(slug);
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    
    const member = await Organization.getMember(org.id, req.user.id);
    if (!member) return res.status(403).json({ error: 'Access denied' });

    const members = await Organization.getMembers(org.id);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { user_id, role } = req.body;
    const { slug } = req.params;
    const org = await Organization.findBySlug(slug);
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    const adminMember = await Organization.getMember(org.id, req.user.id);
    if (!adminMember || adminMember.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can add members' });
    }
    const member = await Organization.addMember(org.id, user_id, role);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { slug } = req.params;
    const org = await Organization.findBySlug(slug);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const adminMember = await Organization.getMember(org.id, req.user.id);
    if (!adminMember || adminMember.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can invite members' });
    }

    const invite = await Invite.create({ org_id: org.id, email, role });
    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invites/accept/${invite.token}`;
    
    await emailService.send({
      to: email,
      subject: `You've been invited to join ${org.name}`,
      body: `Join the organization here: ${inviteUrl}`,
      html: `<p>You've been invited to join <strong>${org.name}</strong>. Click the link below to accept:</p><a href="${inviteUrl}">${inviteUrl}</a>`
    });

    res.status(201).json({ message: 'Invite sent', email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findByToken(token);
    if (!invite) return res.status(400).json({ error: 'Invalid or expired invite' });

    let user = await User.findByEmail(invite.email);
    if (!user) {
      return res.status(400).json({ error: 'User must register before accepting invite', email: invite.email });
    }

    await Organization.addMember(invite.org_id, user.id, invite.role);
    await Invite.delete(invite.id);

    res.json({ message: 'Invite accepted', org_id: invite.org_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { slug, userId } = req.params;
    const org = await Organization.findBySlug(slug);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const adminMember = await Organization.getMember(org.id, req.user.id);
    if (!adminMember || adminMember.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can remove members' });
    }

    await Organization.removeMember(org.id, userId);
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
