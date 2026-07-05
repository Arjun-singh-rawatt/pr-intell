// PATH: pr-intel/backend/src/middleware/requireAuth.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const SESSION_COOKIE = 'pr_intel_session';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const payload = jwt.verify(token, process.env.SESSION_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}