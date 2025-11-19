const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../database/userdb');

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, firstName, lastName} = req.body;

  // Validation
  if (!username || !email || !password || !firstName || !lastName) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if username or email exists
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email or username already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role: req.body.role === 'admin' ? 'admin': 'user',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
      await user.deleteOne(); 
    res.json({ message: 'User account deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add pet to user's bookmarks
// @route   POST /api/users/bookmarks/:petId
// @access  Private
const addBookmark = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { petId } = req.params;

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.bookmarks.includes(petId)) {
    res.status(400);
    throw new Error('Pet already bookmarked');
  }

  user.bookmarks.push(petId);
  await user.save();

  res.status(200).json({ bookmarks: user.bookmarks });
});

// @desc    Remove pet from bookmarks
// @route   DELETE /api/users/bookmarks/:petId
// @access  Private
const removeBookmark = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { petId } = req.params;

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.bookmarks = user.bookmarks.filter(id => id.toString() !== petId);
  await user.save();

  res.status(200).json({ bookmarks: user.bookmarks });
});

// @desc    Get all bookmarked pets
// @route   GET /api/users/bookmarks
// @access  Private
const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('bookmarks');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ bookmarks: user.bookmarks });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  addBookmark,
  removeBookmark,
  getBookmarks
};
