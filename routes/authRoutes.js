const express = require('express');
const { registerUser, loginUser, getUserProfile,changePassword } = require('../controller/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

router.post('/changepassword',protect,changePassword)

module.exports = router;
