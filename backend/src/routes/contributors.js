import express from 'express';
import {
  getContributorProfile,
  getContributorRecentPRs,
  searchContributors,
} from '../services/github.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contributors = await searchContributors(req.query.search || '');
    res.json({ contributors });
  } catch (err) {
    console.error('[GET /api/contributors]', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:username/recent-prs', async (req, res) => {
  try {
    const prs = await getContributorRecentPRs(req.params.username);
    res.json({ prs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const profile = await getContributorProfile(req.params.username);
    res.json(profile);
  } catch (err) {
    console.error(`[GET /api/contributors/${req.params.username}]`, err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
