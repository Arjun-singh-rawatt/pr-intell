import express from 'express';
import { getMergedPRs, getPRDetail } from '../services/github.js';
import { summarizePR } from '../services/ai.js';
import { getRouterStatus } from '../services/aiRouter.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const prs = await getMergedPRs(page);
    res.json({ prs, page });
  } catch (err) {
    console.error('[GET /api/prs]', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/router-status', (_req, res) => {
  try {
    res.json(getRouterStatus());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:number', async (req, res) => {
  try {
    const data = await getPRDetail(req.params.number);
    res.json(data);
  } catch (err) {
    console.error(`[GET /api/prs/${req.params.number}]`, err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:number/summarize', async (req, res) => {
  try {
    const { pr, files, comments } = await getPRDetail(req.params.number);
    const summary = await summarizePR({
      title: pr.title,
      body: pr.body,
      files,
      labels: pr.labels,
      comments,
    });
    res.json(summary);
  } catch (err) {
    console.error(`[POST /api/prs/${req.params.number}/summarize]`, err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
