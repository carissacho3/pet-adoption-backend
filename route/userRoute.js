const express = require('express');
const router = express.Router();

// Import user controller functions
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require('../controller/userController');

// Import middleware
const { protect} = require('../middleware/userMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);


// Protected routes (require authentication)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserProfile); 

module.exports = router;
