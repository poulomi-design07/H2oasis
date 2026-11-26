
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/authMiddleware");

const {
    saveHydrationGoal,
    getHydrationGoal
} = require("../controllers/hydrationGoalController");

// Create or update hydration goal
router.post("/", verifyFirebaseToken, saveHydrationGoal);

// Get active hydration goal
router.get("/", verifyFirebaseToken, getHydrationGoal);

module.exports = router;
