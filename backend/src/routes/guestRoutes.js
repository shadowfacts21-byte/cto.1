const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const { auth } = require('../middleware/authMiddleware');

// Guest login (no auth required)
router.get('/login/:token', guestController.login);

// Management routes (require admin auth)
router.post('/invite', auth, guestController.invite);
router.get('/project/:id', auth, guestController.listProjectGuests);
router.delete('/:id', auth, guestController.revoke);

module.exports = router;
