
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/authMiddleware");

const {
    createProfile,
    getProfile
} = require("../controllers/profileController");

// Create or update profile
router.post("/", verifyFirebaseToken, createProfile);

// Get logged-in user's profile
router.get("/", verifyFirebaseToken, getProfile);

module.exports = router;
