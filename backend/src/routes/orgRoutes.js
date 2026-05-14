const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');
const projectController = require('../controllers/projectController');
const { auth } = require('../middleware/authMiddleware');

// Accept invite (no auth required if user already has email, but they need to be logged in to link their ID)
// Actually, usually you accept then redirect to login/register if not logged in.
// We'll require auth for accept so we know which user ID to add.
router.post('/invites/accept/:token', auth, orgController.acceptInvite);

router.use(auth);

router.post('/', orgController.createOrg);
router.get('/', orgController.listOrgs);
router.get('/:slug', orgController.getOrg);

router.get('/:slug/members', orgController.listMembers);
router.post('/:slug/members', orgController.addMember);
router.post('/:slug/invites', orgController.inviteMember);
router.delete('/:slug/members/:userId', orgController.removeMember);

// Projects nested under orgs for creation/listing by org
router.post('/:slug/projects', projectController.createProject);
router.get('/:slug/projects', projectController.listProjects);

module.exports = router;
