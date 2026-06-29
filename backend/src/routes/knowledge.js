// PATH: pr-intel/backend/src/routes/knowledge.js

import express from 'express';
import { scrapePRs, scrapeIssues } from '../services/scraper.js';
import { scrapeDocs } from '../services/docsScraper.js';
import { getIndexStats, searchIndex } from '../utils/rag/bm25.js';

const router = express.Router();

let lastScrapedAt = null;
let scrapeInProgress = false;

// POST /api/knowledge/scrape — GitHub merged PRs
router.post('/scrape', async (req, res) => {
  if (scrapeInProgress) {
    return res.status(409).json({ error: 'Scrape already running' });
  }
  const pages = Math.min(parseInt(req.body?.pages, 10) || 5, 20);
  scrapeInProgress = true;
  try {
    const result = await scrapePRs(pages);
    lastScrapedAt = new Date().toISOString();
    res.json({ ...result, lastScrapedAt });
  } catch (err) {
    console.error('[knowledge/scrape]', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    scrapeInProgress = false;
  }
});

// POST /api/knowledge/scrape-issues — GitHub issues
router.post('/scrape-issues', async (req, res) => {
  if (scrapeInProgress) {
    return res.status(409).json({ error: 'Scrape already running' });
  }
  const pages = Math.min(parseInt(req.body?.pages, 10) || 10, 15);
  scrapeInProgress = true;
  try {
    const result = await scrapeIssues(pages);
    lastScrapedAt = new Date().toISOString();
    res.json({ ...result, lastScrapedAt });
  } catch (err) {
    console.error('[knowledge/scrape-issues]', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    scrapeInProgress = false;
  }
});

// POST /api/knowledge/scrape-docs — developer.rocket.chat docs
router.post('/scrape-docs', async (req, res) => {
  if (scrapeInProgress) {
    return res.status(409).json({ error: 'Scrape already running' });
  }
  scrapeInProgress = true;
  try {
    const result = await scrapeDocs();
    lastScrapedAt = new Date().toISOString();
    res.json({ ...result, lastScrapedAt });
  } catch (err) {
    console.error('[knowledge/scrape-docs]', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    scrapeInProgress = false;
  }
});

// GET /api/knowledge/status
router.get('/status', (_req, res) => {
  const stats = getIndexStats();
  res.json({
    built: stats.built,
    totalChunks: stats.count,
    lastScrapedAt,
    scrapeInProgress,
  });
});

// GET /api/knowledge/search?q=federation&k=8
router.get('/search', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Provide ?q= param' });
  const topK = Math.min(parseInt(req.query.k, 10) || 8, 20);
  const results = searchIndex(q, topK);
  res.json({
    query: q,
    count: results.length,
    results: results.map((r) => ({
      id: r.id,
      type: r.type,
      number: r.number,
      title: r.title,
      labels: r.labels,
      score: r._score?.toFixed(4),
    })),
  });
});

export default router;