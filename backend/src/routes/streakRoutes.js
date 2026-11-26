
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/authMiddleware");
const { getStreak } = require("../controllers/streakController");

router.get("/", verifyFirebaseToken, getStreak);

module.exports = router;
