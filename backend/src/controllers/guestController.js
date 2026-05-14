const GuestAccess = require('../models/guestAccessModel');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

const guestController = {
  invite: async (req, res) => {
    try {
      const { orgId, email, projectId, accessLevel } = req.body;
      const invite = await GuestAccess.invite({
        org_id: orgId,
        email,
        project_id: projectId,
        access_level: accessLevel
      });
      
      const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/guests/login/${invite.token}`;
      await emailService.sendGuestInvite(email, inviteUrl);

      res.status(201).json({
        message: 'Guest invited',
        inviteUrl
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  listProjectGuests: async (req, res) => {
    try {
      const { id } = req.params; // project id
      const guests = await GuestAccess.listByProject(id);
      res.json(guests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { token } = req.params;
      const guest = await GuestAccess.findByToken(token);
      if (!guest) {
        return res.status(401).json({ error: 'Invalid or expired invite token' });
      }
      // Create guest JWT
      const jwtToken = jwt.sign(
        { id: guest.id, email: guest.email, role: 'guest', projectId: guest.project_id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
      res.json({ token: jwtToken, guest });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  revoke: async (req, res) => {
    try {
      const { id } = req.params;
      await GuestAccess.revoke(id);
      res.json({ message: 'Guest access revoked' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = guestController;
