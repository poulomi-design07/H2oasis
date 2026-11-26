
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/authMiddleware");

const {
    createIntake,
    getIntakeHistory,
    deleteIntake
} = require("../controllers/intakeController");

// Record a new intake
router.post("/", verifyFirebaseToken, createIntake);

// Get intake history
router.get("/", verifyFirebaseToken, getIntakeHistory);

// Delete an intake record
router.delete("/:id", verifyFirebaseToken, deleteIntake);

module.exports = router;
