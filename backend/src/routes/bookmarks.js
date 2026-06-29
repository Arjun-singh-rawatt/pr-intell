import express from 'express';
import { listBookmarks, removeBookmark, upsertBookmark } from '../services/store.js';

const router = express.Router();
const TYPES = new Set(['pr', 'kb', 'contributor']);

router.get('/', async (req, res) => {
  try {
    const type = req.query.type;
    if (type && !TYPES.has(type)) {
      return res.status(400).json({ error: 'Invalid bookmark type' });
    }
    const bookmarks = await listBookmarks(type || null);
    res.json({ bookmarks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!TYPES.has(type)) {
      return res.status(400).json({ error: 'Invalid bookmark type' });
    }
    const store = await upsertBookmark(type, id, req.body);
    res.json(store.bookmarks[type][String(id)]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!TYPES.has(type)) {
      return res.status(400).json({ error: 'Invalid bookmark type' });
    }
    await removeBookmark(type, id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
