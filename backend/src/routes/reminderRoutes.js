
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/authMiddleware");

const {
    getReminderSettings,
    saveReminderSettings
} = require("../controllers/reminderController");

// Get reminder settings
router.get("/", verifyFirebaseToken, getReminderSettings);

// Create or update reminder settings
router.put("/", verifyFirebaseToken, saveReminderSettings);

module.exports = router;
