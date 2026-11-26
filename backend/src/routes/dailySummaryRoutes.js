
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/authMiddleware");

const {
    getDailySummary
} = require("../controllers/dailySummaryController");

// Get today's hydration summary
router.get("/", verifyFirebaseToken, getDailySummary);

module.exports = router;