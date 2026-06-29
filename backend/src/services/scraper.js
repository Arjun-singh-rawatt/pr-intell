// PATH: pr-intel/backend/src/services/scraper.js

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildIndex } from '../utils/rag/bm25.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHUNKS_PATH = path.join(__dirname, '../../data/kb_chunks.json');

const BASE = 'https://api.github.com';
const REPO = 'RocketChat/Rocket.Chat';

function ghHeaders() {
  const h = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'pr-intel-scraper',
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function ghFetch(url) {
  const res = await fetch(url, { headers: ghHeaders() });
  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get('x-ratelimit-reset');
    throw new Error(`GitHub rate limit. Resets at ${new Date(reset * 1000).toISOString()}`);
  }
  if (!res.ok) throw new Error(`GitHub ${res.status} on ${url}`);
  return res.json();
}

async function fetchPRFiles(prNumber) {
  try {
    const files = await ghFetch(
      `${BASE}/repos/${REPO}/pulls/${prNumber}/files?per_page=20`
    );
    return files.map((f) => f.filename);
  } catch {
    return [];
  }
}

function prToChunk(pr, files = []) {
  const cleanBody = (pr.body || '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/```[\s\S]{0,2000}?```/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 800);

  return {
    id: `pr-${pr.number}`,
    type: 'pr',
    number: pr.number,
    title: pr.title,
    body: cleanBody,
    labels: (pr.labels || []).map((l) => l.name),
    files: files.slice(0, 15),
    merged_at: pr.merged_at,
    author: pr.user?.login || '',
    url: pr.html_url,
  };
}

export async function scrapePRs(pages = 5) {
  let existing = [];
  try {
    const raw = await fs.readFile(CHUNKS_PATH, 'utf8');
    existing = JSON.parse(raw);
  } catch {
    existing = [];
  }

  const chunkMap = new Map(existing.map((c) => [c.id, c]));
  let fetched = 0;
  let skipped = 0;

  console.log(`[scraper] PRs start — ${pages} pages, existing: ${chunkMap.size}`);

  for (let page = 1; page <= pages; page++) {
    let prs;
    try {
      const url = `${BASE}/repos/${REPO}/pulls?state=closed&sort=updated&direction=desc&per_page=20&page=${page}`;
      prs = await ghFetch(url);
    } catch (err) {
      console.error(`[scraper] Page ${page} failed: ${err.message}`);
      break;
    }

    const merged = prs.filter((pr) => pr.merged_at !== null);

    for (const pr of merged) {
      const id = `pr-${pr.number}`;
      if (chunkMap.has(id)) { skipped++; continue; }
      const files = await fetchPRFiles(pr.number);
      chunkMap.set(id, prToChunk(pr, files));
      fetched++;
      await new Promise((r) => setTimeout(r, 150));
    }

    console.log(`[scraper] PRs page ${page} done — ${merged.length} merged, ${fetched} new`);
    await new Promise((r) => setTimeout(r, 400));
  }

  const allChunks = Array.from(chunkMap.values());
  await fs.writeFile(CHUNKS_PATH, JSON.stringify(allChunks, null, 2), 'utf8');

  const indexed = await buildIndex();
  const result = { fetched, skipped, total: allChunks.length, indexed };
  console.log(`[scraper] PRs done — ${JSON.stringify(result)}`);
  return result;
}

export async function scrapeIssues(pages = 10) {
  let existing = [];
  try {
    const raw = await fs.readFile(CHUNKS_PATH, 'utf8');
    existing = JSON.parse(raw);
  } catch {
    existing = [];
  }

  const chunkMap = new Map(existing.map((c) => [c.id, c]));
  let fetched = 0;
  let skipped = 0;

  console.log(`[scraper] Issues start — ${pages} pages, existing: ${chunkMap.size}`);

  for (let page = 1; page <= pages; page++) {
    let result;
    try {
      const url = `${BASE}/search/issues?q=repo:${REPO}+type:issue+state:closed&sort=updated&per_page=20&page=${page}`;
      result = await ghFetch(url);
    } catch (err) {
      console.error(`[scraper] Issues page ${page} failed: ${err.message}`);
      break;
    }

    const issues = result.items || [];

    for (const issue of issues) {
      const id = `issue-${issue.number}`;
      if (chunkMap.has(id)) { skipped++; continue; }

      let topComment = '';
      try {
        const comments = await ghFetch(
          `${BASE}/repos/${REPO}/issues/${issue.number}/comments?per_page=3`
        );
        if (comments.length > 0) {
          topComment = (comments[0].body || '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 300);
        }
      } catch { /* non-critical */ }

      const cleanBody = (issue.body || '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/```[\s\S]{0,2000}?```/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 600);

      chunkMap.set(id, {
        id,
        type: 'issue',
        number: issue.number,
        title: issue.title,
        body: cleanBody,
        topComment,
        labels: (issue.labels || []).map((l) => l.name),
        files: [],
        commentCount: issue.comments,
        merged_at: issue.closed_at,
        author: issue.user?.login || '',
        url: issue.html_url,
      });

      fetched++;
      await new Promise((r) => setTimeout(r, 200));
    }

    console.log(`[scraper] Issues page ${page} — ${issues.length} found, ${fetched} new`);
    await new Promise((r) => setTimeout(r, 800));
  }

  const allChunks = Array.from(chunkMap.values());
  await fs.writeFile(CHUNKS_PATH, JSON.stringify(allChunks, null, 2), 'utf8');

  const indexed = await buildIndex();
  const result = { fetched, skipped, total: allChunks.length, indexed };
  console.log(`[scraper] Issues done — ${JSON.stringify(result)}`);
  return result;
}