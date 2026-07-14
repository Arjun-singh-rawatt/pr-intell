import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
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

  let user = await User.findOne({ githubId: 'dev-github-user' });
  if (!user) {
    user = await User.create({
      githubId: 'dev-github-user',
      email: 'user@printel.local',
      name: 'GitHub User',
      apiKeys: {},
    });
  }

  const token = createSessionToken(user._id);
  setSessionCookie(res, token);
  res.redirect(redirectTo);
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const payload = jwt.verify(token, SESSION_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        apiKeys: user.apiKeys || {},
      },
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ ok: true });
});

export default router;
