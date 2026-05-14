const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/login/:token", guestController.login);

router.post("/invite", authMiddleware, guestController.invite);
router.get("/project/:id", authMiddleware, guestController.listProjectGuests);
router.delete("/:id", authMiddleware, guestController.revoke);

module.exports = router;
