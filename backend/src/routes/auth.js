import express from 'express';
import jwt from 'jsonwebtoken';
import {
  findUserById,
  getOrCreateGithubUser,
  serializeUserForClient,
} from '../services/authUsers.js';
import { SESSION_COOKIE, SESSION_SECRET } from '../middleware/requireAuth.js';

const router = express.Router();

function createSessionToken(userId) {
  return jwt.sign({ userId }, SESSION_SECRET, { expiresIn: '7d' });
}

function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

router.get('/github', async (req, res) => {
  const redirectTo = req.query.redirect || '/';
  const user = await getOrCreateGithubUser();
  const userId = user._id ? user._id.toString() : String(user.id);

  setSessionCookie(res, createSessionToken(userId));
  res.redirect(redirectTo);
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const payload = jwt.verify(token, SESSION_SECRET);
    const user = await findUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    return res.json(serializeUserForClient(user));
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ ok: true });
});

export default router;
