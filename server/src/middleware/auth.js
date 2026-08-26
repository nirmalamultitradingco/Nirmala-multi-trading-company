import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verifies the JWT and attaches the user. Used on all write/admin routes.
export const protect = async (req, res, next) => {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Please sign in.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Session no longer valid.' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired. Please sign in again.' });
  }
};
