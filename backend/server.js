
const express = require("express");

const app = express();

const PORT = 5000;

// First API route
app.get("/", (req, res) => {
    res.send("Welcome to AquaTrack Backend!");
});

app.get("/api/health", (req, res) => {

    console.log("Method:", req.method);
    console.log("URL:", req.url);

    res.status(200).json({
        success: true,
        message: "AquaTrack API is running"
    });

});

// Start server
app.listen(PORT, () => {
    console.log(`AquaTrack server running on port ${PORT}`);
});
