import jwt from 'jsonwebtoken';
import { findUserById } from '../services/authUsers.js';

export const SESSION_COOKIE = 'pr_intel_session';
export const SESSION_SECRET = process.env.SESSION_SECRET?.trim() || 'pr_intel_dev_secret';

if (!process.env.SESSION_SECRET) {
  console.warn('WARNING: SESSION_SECRET is not set; using a development fallback secret.');
}

export async function getAuthenticatedUser(req) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;

  const payload = jwt.verify(token, SESSION_SECRET);
  return findUserById(payload.userId);
}

export async function requireAuth(req, res, next) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}
