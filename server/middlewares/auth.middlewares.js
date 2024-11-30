const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid user or token expired.' });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    return res.status(400).json({ message: 'Invalid token: ' + error.message });
  }
};
