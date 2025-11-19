const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../database/userdb');

// Protect middleware to check for authentication and role-based access
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      req.userRole = req.user.role; 
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error('Token expired, please log in again');
      } else {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }
  }


  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});


const checkAdminRole = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const role = authHeader.split(' ')[1]; 
  if (role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  next();
};

module.exports = { protect, checkAdminRole };
