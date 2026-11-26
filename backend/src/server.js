
require("dotenv").config();

const express = require("express");
const supabase = require("./config/supabase");
const verifyFirebaseToken = require("./middleware/authMiddleware");
const helmet = require("helmet");
const cors = require("cors");

// Import routes
const profileRoutes = require("./routes/profileRoutes");
const hydrationGoalRoutes = require("./routes/hydrationGoalRoutes");
const drinkRoutes = require("./routes/drinkRoutes");
const intakeRoutes = require("./routes/intakeRoutes");
const dailySummaryRoutes = require("./routes/dailySummaryRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");
const streakRoutes = require("./routes/streakRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// JSON middleware
app.use(express.json({ limit: "100kb" }));
// API routes
app.use("/api/profile", profileRoutes);
app.use("/api/hydration-goal", hydrationGoalRoutes);
app.use("/api/drinks", drinkRoutes);
app.use("/api/intake", intakeRoutes);
app.use("/api/daily-summary", dailySummaryRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/streak", streakRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("AquaTrack Backend is running!");
});

// Supabase connection test
app.get("/api/test-db", verifyFirebaseToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("drink_categories")
            .select("name")
            .limit(1);

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: "Supabase connected successfully!",
            data
        });

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Supabase connection failed"
        });
    }
});

// Firebase authentication test
app.get("/api/auth/check", verifyFirebaseToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Firebase authentication successful!",
        user: req.user
    });
});

// Centralized error handling
app.use((err, req, res, next) => {

    // Request body exceeds 100 KB
    if (err.type === "entity.too.large") {
        return res.status(413).json({
            success: false,
            message: "Request body is too large. Maximum allowed size is 100 KB."
        });
    }

    // Invalid JSON
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body"
        });
    }

    // Other unexpected errors
    console.error("Server error:", err.message);

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`AquaTrack backend running on port ${PORT}`);
});
