import express from 'express';
import jwt from 'jsonwebtoken';
import {
  findUserById,
  getOrCreateGithubUser,
  serializeUserForClient,
} from '../services/authUsers.js';
import { SESSION_COOKIE, getSessionSecret } from '../middleware/requireAuth.js';

const router = express.Router();

function createSessionToken(userId) {
  return jwt.sign({ userId }, getSessionSecret(), { expiresIn: '7d' });
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
  if (!process.env.GITHUB_CLIENT_ID) {
    console.warn('GITHUB_CLIENT_ID not found, falling back to local dev user.');
    let githubId = 'dev-github-user';
    let username = 'github-user';
    let avatarUrl = '';
    let displayName = 'GitHub User';

    if (process.env.GITHUB_TOKEN) {
      try {
        const userRes = await fetch('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        });
        if (userRes.ok) {
          const ghUser = await userRes.json();
          githubId = ghUser.id || githubId;
          username = ghUser.login || username;
          avatarUrl = ghUser.avatar_url || avatarUrl;
          displayName = ghUser.name || ghUser.login || displayName;
        }
      } catch (err) {
        console.error('Failed to fetch github user with token', err);
      }
    }

    const user = await getOrCreateGithubUser(githubId, username, avatarUrl, displayName);
    const userId = user._id ? user._id.toString() : String(user.id);
    setSessionCookie(res, createSessionToken(userId));
    return res.redirect(process.env.CLIENT_URL || 'http://localhost:3001/');
  }
  const redirectUri = process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback';
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`;
  res.redirect(url);
});

router.get('/github/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('No code provided');
  }
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('GitHub OAuth error:', tokenData);
      return res.status(401).send('Failed to obtain access token');
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const githubUser = await userResponse.json();

    const user = await getOrCreateGithubUser(
      githubUser.id,
      githubUser.login,
      githubUser.avatar_url,
      githubUser.name || githubUser.login
    );
    const userId = user._id ? user._id.toString() : String(user.id);

    setSessionCookie(res, createSessionToken(userId));
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3001/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const payload = jwt.verify(token, getSessionSecret());
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
