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


const checkAdminRole = asyncHandler(async (req, res, next) => {
  console.log(req.userRole);
  if (req.userRole !== 'admin') {
    res.status(403);
    throw new Error('Forbidden, admin access required');
  }
  next(); 
});

module.exports = { protect, checkAdminRole };
