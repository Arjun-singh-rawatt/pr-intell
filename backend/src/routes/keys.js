import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { encrypt, decrypt, maskKey } from '../utils/crypto.js';

const router = express.Router();
const PROVIDERS = ['gemini', 'groq', 'openrouter'];

function assertProvider(provider, res) {
  if (!PROVIDERS.includes(provider)) {
    res.status(400).json({ error: `Unknown provider "${provider}". Must be one of: ${PROVIDERS.join(', ')}` });
    return false;
  }
  return true;
}

router.get('/', requireAuth, (req, res) => {
  const status = {};
  for (const provider of PROVIDERS) {
    const record = req.user.apiKeys?.[provider];
    status[provider] = record
      ? {
          configured: true,
          updatedAt: record.updatedAt,
          masked: record.masked || '••••••••',
        }
      : { configured: false };
  }
  res.json(status);
});

router.post('/:provider', requireAuth, async (req, res) => {
  try {
    const { provider } = req.params;
    if (!assertProvider(provider, res)) return;

    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 8) {
      return res.status(400).json({ error: 'apiKey is required and must be a valid key string' });
    }

    const encrypted = encrypt(apiKey.trim());
    req.user.apiKeys = req.user.apiKeys || {};
    const masked = maskKey(apiKey.trim());
    req.user.apiKeys[provider] = { ...encrypted, masked, updatedAt: new Date() };
    await req.user.save();

    res.json({
      provider,
      configured: true,
      masked,
      updatedAt: req.user.apiKeys[provider].updatedAt,
    });
  } catch (err) {
    console.error('Failed to store API key:', err.message);
    res.status(500).json({ error: 'Failed to store API key' });
  }
});

router.delete('/:provider', requireAuth, async (req, res) => {
  try {
    const { provider } = req.params;
    if (!assertProvider(provider, res)) return;

    if (req.user.apiKeys?.[provider]) {
      req.user.apiKeys[provider] = undefined;
      await req.user.save();
    }
    res.json({ provider, configured: false });
  } catch (err) {
    console.error('Failed to delete API key:', err.message);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

// Internal helper for aiRouter.js to get a user's plaintext key at call time.
// Never expose plaintext through an HTTP response.
export async function getDecryptedKey(user, provider) {
  const record = user?.apiKeys?.[provider];
  if (!record) return null;
  return decrypt(record);
}

export default router;
