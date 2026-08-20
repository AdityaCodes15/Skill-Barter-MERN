const express = require("express");

const {
    getProfile,
    updateProfile
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;