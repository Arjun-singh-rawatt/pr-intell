import express from 'express';
import { searchMergedPRs } from '../services/github.js';
import { listKbDocuments } from '../services/kb.js';
import { searchContributors } from '../services/github.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const type = req.query.type || 'all';

    if (!q) {
      return res.json({ prs: [], contributors: [], kb: [], ai: [] });
    }

    const [prs, contributors, kb] = await Promise.all([
      type === 'all' || type === 'pr' ? searchMergedPRs(q) : Promise.resolve([]),
      type === 'all' || type === 'contributors' ? searchContributors(q) : Promise.resolve([]),
      type === 'all' || type === 'kb' ? listKbDocuments(q) : Promise.resolve([]),
    ]);

    res.json({ prs, contributors, kb, query: q, type });
  } catch (err) {
    console.error('[GET /api/search]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
