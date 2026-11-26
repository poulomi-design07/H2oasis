
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/authMiddleware");

const {
    getStatistics
} = require("../controllers/statisticsController");

// Get hydration statistics
router.get("/", verifyFirebaseToken, getStatistics);

module.exports = router;