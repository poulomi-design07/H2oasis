
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/authMiddleware");

const {
    registerDevice,
    getDevices,
    deleteDevice
} = require("../controllers/deviceController");

// Register a device
router.post("/", verifyFirebaseToken, registerDevice);

// Get registered devices
router.get("/", verifyFirebaseToken, getDevices);

// Delete a device
router.delete("/:id", verifyFirebaseToken, deleteDevice);

module.exports = router;
