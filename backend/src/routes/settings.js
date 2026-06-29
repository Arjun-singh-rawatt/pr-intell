import express from 'express';
import { getSettings, updateSettings } from '../services/store.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const allowed = ['displayName', 'username', 'darkMode', 'notifications'];
    const patch = {};
    for (const key of allowed) {
      if (key in req.body) patch[key] = req.body[key];
    }
    const store = await updateSettings(patch);
    res.json(store.settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
