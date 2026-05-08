const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', taskController.createTask);
router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

router.post('/:id/comments', taskController.addComment);
router.get('/:id/comments', taskController.getComments);
router.get('/:id/activity', taskController.getActivity);

module.exports = router;
