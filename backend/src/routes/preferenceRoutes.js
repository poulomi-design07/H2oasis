
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/authMiddleware");

const {
    getPreferences,
    addPreference,
    deletePreference
} = require("../controllers/preferenceController");

// Get user's preferences
router.get("/", verifyFirebaseToken, getPreferences);

// Add a drink preference
router.post("/", verifyFirebaseToken, addPreference);

// Delete a drink preference
router.delete("/:id", verifyFirebaseToken, deletePreference);

module.exports = router;
