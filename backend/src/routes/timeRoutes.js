const express = require('express');
const router = express.Router();
const timeController = require('../controllers/timeController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/tasks/:id/time-entries', timeController.listByTask);
router.post('/tasks/:id/time-entries', timeController.startTimer);
router.patch('/time-entries/:entryId/stop', timeController.stopTimer);
router.get('/projects/:projectId/time-report', timeController.getProjectReport);
router.get('/users/:userId/time-report', timeController.getUserReport);

module.exports = router;
