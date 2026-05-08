const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkProjectLimit } = require('../middleware/planLimitsMiddleware');

router.use(authMiddleware);

router.post('/', orgController.createOrg);
router.get('/', orgController.listOrgs);
router.get('/:slug', orgController.getOrg);
router.post('/:slug/members', orgController.addMember);

// Projects nested under orgs for creation/listing by org
router.post('/:slug/projects', checkProjectLimit, projectController.createProject);
router.get('/:slug/projects', projectController.listProjects);

module.exports = router;
