import jwt from 'jsonwebtoken';
import { env } from '../config/config.js';

const jwtSecret = env.jwtSecret;

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for token in header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
