import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  deleteUserApiKey,
  getUserApiKeys,
  saveUserApiKey,
  SUPPORTED_KEY_PROVIDERS,
} from '../services/authUsers.js';
import { decrypt, encrypt, maskKey } from '../utils/crypto.js';

const router = express.Router();

function buildStatus(apiKeys) {
  return Object.fromEntries(
    SUPPORTED_KEY_PROVIDERS.map((provider) => {
      const record = apiKeys?.[provider];
      if (!record?.ciphertext || !record?.iv || !record?.authTag) {
        return [provider, { configured: false, masked: '' }];
      }

      let masked = '********';
      try {
        masked = maskKey(decrypt(record));
      } catch {
        masked = '********';
      }

      return [provider, { configured: true, masked }];
    })
  );
}

function validateProvider(provider) {
  return SUPPORTED_KEY_PROVIDERS.includes(provider);
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const apiKeys = await getUserApiKeys(req.user);
    res.json(buildStatus(apiKeys));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:provider', requireAuth, async (req, res) => {
  try {
    const { provider } = req.params;
    const apiKey = String(req.body?.apiKey || '').trim();

    if (!validateProvider(provider)) {
      return res.status(400).json({ error: 'Unsupported provider' });
    }
    if (!apiKey) {
      return res.status(400).json({ error: 'apiKey is required' });
    }

    const updatedUser = await saveUserApiKey(req.user, provider, {
      ...encrypt(apiKey),
      updatedAt: new Date().toISOString(),
    });

    const apiKeys = await getUserApiKeys(updatedUser);
    res.status(201).json(buildStatus(apiKeys));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:provider', requireAuth, async (req, res) => {
  try {
    const { provider } = req.params;

    if (!validateProvider(provider)) {
      return res.status(400).json({ error: 'Unsupported provider' });
    }

    const updatedUser = await deleteUserApiKey(req.user, provider);
    const apiKeys = await getUserApiKeys(updatedUser);
    res.json(buildStatus(apiKeys));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
