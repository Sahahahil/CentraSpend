const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing auth header' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) throw new Error('User not found');
    req.user = user; // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
