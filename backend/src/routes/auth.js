
import express from 'express';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth, SESSION_COOKIE } from '../middleware/requireAuth.js';

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// Step 1: redirect the browser to GitHub's consent screen
router.get('/github', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
    scope: 'read:user',
    prompt: 'select_account',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

// Step 2: GitHub redirects back here with a ?code=... to exchange for a token
router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) throw new Error('Missing code from GitHub');

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      throw new Error(tokenData.error_description || 'GitHub token exchange failed');
    }

    const profileRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'pr-intel-app',
      },
    });
    const profile = await profileRes.json();
    if (!profile?.id) throw new Error('Could not fetch GitHub profile');

    const update = {
      username: profile.login,
      displayName: profile.name || profile.login,
      avatarUrl: profile.avatar_url,
    };

    const user = await User.findOneAndUpdate(
      { githubId: String(profile.id) },
      { $set: update, $setOnInsert: { githubId: String(profile.id) } },
      { upsert: true, new: true }
    );

    const session = jwt.sign({ userId: user._id.toString() }, process.env.SESSION_SECRET, {
      expiresIn: '7d',
    });

    res.cookie(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${FRONTEND_URL}/settings`);
  } catch (err) {
    console.error('GitHub OAuth callback failed:', err.message);
    res.redirect(`${FRONTEND_URL}/settings?error=auth_failed`);
  }
});

// Returns the logged-in user's public profile (never keys, even encrypted ones)
router.get('/me', requireAuth, (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    displayName: req.user.displayName,
    avatarUrl: req.user.avatarUrl,
  });
});

router.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.json({ ok: true });
});

export default router;
