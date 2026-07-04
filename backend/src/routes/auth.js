import express from 'express';
import {
  createSession,
  createUser,
  deleteSessionByToken,
  deleteUserApiKey,
  findUserApiKey,
  findUserByGitHubId,
  listUserApiKeys,
  updateUser,
  upsertUserApiKey,
} from '../db/authStore.js';
import { randomToken, encrypt, decrypt, maskKey } from '../utils/crypto.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL  = 'https://api.github.com/user';

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: SESSION_DURATION_MS,
    path: '/',
  };
}

// ── Step 1: Redirect browser to GitHub ───────────────
router.get('/github', (_req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
    scope: 'read:user user:email',
  });
  res.redirect(`${GITHUB_OAUTH_URL}?${params}`);
});

// ── Step 2: GitHub sends back a ?code — exchange it ──
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

  if (!code) return res.redirect(`${frontendUrl}?auth=error&reason=no_code`);

  try {
    // Exchange code → access_token (server-to-server, never touches browser)
    const tokenRes = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      }),
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error || !tokenData.access_token) {
      console.error('[Auth] GitHub token error:', tokenData);
      return res.redirect(`${frontendUrl}?auth=error&reason=token_exchange`);
    }

    // Fetch GitHub profile using the access_token
    const profileRes = await fetch(GITHUB_USER_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    const profile = await profileRes.json();

    // Find-or-create user
    let user = await findUserByGitHubId(String(profile.id));
    if (!user) {
      user = await createUser({
        githubId:    String(profile.id),
        username:    profile.login,
        avatarUrl:   profile.avatar_url || '',
        email:       profile.email || '',
        displayName: profile.name || profile.login,
      });
    } else {
      user = await updateUser(user._id, {
        username: profile.login,
        avatarUrl: profile.avatar_url || user.avatarUrl,
        displayName: profile.name || profile.login,
        email: profile.email || user.email,
      });
    }

    // Create session
    const token = randomToken();
    await createSession({
      userId:    user._id,
      token,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    });

    // Set httpOnly cookie — the GitHub access_token is NOT stored in the cookie
    res.cookie('prsession', token, sessionCookieOptions());
    res.redirect(`${frontendUrl}?auth=success`);
  } catch (err) {
    console.error('[Auth] GitHub callback error:', err);
    res.redirect(`${frontendUrl}?auth=error&reason=server`);
  }
});

// ── GET /api/auth/me — who is logged in? ─────────────
router.get('/me', requireAuth, (req, res) => {
  const u = req.user;
  res.json({
    id:          u._id,
    username:    u.username,
    displayName: u.displayName,
    avatarUrl:   u.avatarUrl,
    email:       u.email,
  });
});

// ── POST /api/auth/logout ─────────────────────────────
router.post('/logout', requireAuth, async (req, res) => {
  try {
    await deleteSessionByToken(req.cookies.prsession);
    res.clearCookie('prsession', { path: '/' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/auth/keys — list user's configured providers ──
router.get('/keys', requireAuth, async (req, res) => {
  try {
    const rows = await listUserApiKeys(req.user._id);
    // Never send the raw key — send masked version only
    const result = rows.map((row) => ({
      provider: row.provider,
      maskedKey: maskKey(decrypt(row.encryptedKey)),
      addedAt: row.addedAt,
      lastUsedAt: row.lastUsedAt,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/auth/keys/:provider — save or update a key ──
router.put('/keys/:provider', requireAuth, async (req, res) => {
  const { provider } = req.params;
  const { apiKey } = req.body;

  const ALLOWED = ['gemini', 'groq', 'openrouter', 'deepseek', 'anthropic', 'openai'];
  if (!ALLOWED.includes(provider)) {
    return res.status(400).json({ error: `Unknown provider: ${provider}` });
  }
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 8) {
    return res.status(400).json({ error: 'Invalid API key' });
  }

  try {
    const encryptedKey = encrypt(apiKey.trim());
    await upsertUserApiKey(req.user._id, provider, encryptedKey);
    res.json({ ok: true, provider, maskedKey: maskKey(apiKey.trim()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/auth/keys/:provider — remove a key ───
router.delete('/keys/:provider', requireAuth, async (req, res) => {
  try {
    await deleteUserApiKey(req.user._id, req.params.provider);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/keys/:provider/test — test a key live ──
router.post('/keys/:provider/test', requireAuth, async (req, res) => {
  const { provider } = req.params;
  try {
    const row = await findUserApiKey(req.user._id, provider);
    if (!row) return res.status(404).json({ error: 'No key configured for this provider' });

    const key = decrypt(row.encryptedKey);
    let ok = false;
    let detail = '';

    if (provider === 'gemini') {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
      );
      ok = r.ok;
      detail = ok ? 'Gemini API responded successfully' : `HTTP ${r.status}`;
    } else if (provider === 'groq') {
      const r = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      ok = r.ok;
      detail = ok ? 'Groq API responded successfully' : `HTTP ${r.status}`;
    } else if (provider === 'openrouter') {
      const r = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      ok = r.ok;
      detail = ok ? 'OpenRouter API responded successfully' : `HTTP ${r.status}`;
    } else {
      detail = 'Test not implemented for this provider yet';
      ok = false;
    }

    res.json({ ok, provider, detail });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
