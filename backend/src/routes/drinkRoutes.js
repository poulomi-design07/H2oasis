
const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/authMiddleware");

const {
    getDrinks,
    getDrinkCategories
} = require("../controllers/drinkController");

// Get all active drinks
router.get("/", verifyFirebaseToken, getDrinks);

// Get all drink categories
router.get("/categories", verifyFirebaseToken, getDrinkCategories);

module.exports = router;
