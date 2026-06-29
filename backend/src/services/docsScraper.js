// PATH: pr-intel/backend/src/services/docsScraper.js

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildIndex } from '../utils/rag/bm25.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHUNKS_PATH = path.join(__dirname, '../../data/kb_chunks.json');

const LLMS_TXT = 'https://developer.rocket.chat/llms.txt';

// Only fetch pages relevant to contributors — skip mobile, white-label, SSL etc.
const RELEVANT_KEYWORDS = [
  'architecture', 'repository', 'server', 'federation', 'apps-engine',
  'livechat', 'omnichannel', 'fuselage', 'meteor', 'development-environment',
  'troubleshooting', 'event-interface', 'slash-command', 'blocks', 'surfaces',
  'create-an-app', 'getting-started', 'http-requests', 'uikit',
];

function isRelevant(url) {
  const lower = url.toLowerCase();
  return RELEVANT_KEYWORDS.some((kw) => lower.includes(kw));
}

async function fetchDocPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'pr-intel-docs-scraper' },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function parseDocPage(rawMarkdown, url) {
  // Strip frontmatter
  const withoutFrontmatter = rawMarkdown
    .replace(/^---[\s\S]*?---\n/, '')
    .trim();

  // Strip the llms.txt notice block
  const withoutNotice = withoutFrontmatter
    .replace(/>\s*##\s*Documentation Index[\s\S]*?\n\n/, '')
    .trim();

  // Extract title from first # heading
  const titleMatch = withoutNotice.match(/^#\s+(.+)/m);
  const title = titleMatch ? titleMatch[1].trim() : url.split('/').pop();

  // Clean and truncate body
  const body = withoutNotice
    .replace(/!\[.*?\]\(.*?\)/g, '')        // images
    .replace(/```[\s\S]{0,3000}?```/g, '')  // code blocks
    .replace(/#{1,6}\s/g, '')               // headings
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1000);

  return { title, body };
}

export async function scrapeDocs() {
  // Load existing chunks
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

  // Step 1: Fetch the page index
  console.log('[docs] Fetching llms.txt index...');
  const indexRes = await fetch(LLMS_TXT, {
    headers: { 'User-Agent': 'pr-intel-docs-scraper' },
  });
  if (!indexRes.ok) throw new Error(`Failed to fetch llms.txt: ${indexRes.status}`);
  const indexText = await indexRes.text();

  // Step 2: Parse all .md URLs from the index
  const allUrls = [];
  const urlRegex = /https:\/\/developer\.rocket\.chat\/docs\/[^\s)]+\.md/g;
  let match;
  while ((match = urlRegex.exec(indexText)) !== null) {
    allUrls.push(match[0]);
  }

  // Step 3: Filter to relevant pages only
  const relevantUrls = allUrls.filter(isRelevant);
  console.log(`[docs] ${allUrls.length} total pages, ${relevantUrls.length} relevant`);

  // Step 4: Fetch each page
  for (const url of relevantUrls) {
    const slug = url.split('/').pop().replace('.md', '');
    const id = `doc-${slug}`;

    if (chunkMap.has(id)) {
      skipped++;
      continue;
    }

    const raw = await fetchDocPage(url);
    if (!raw) {
      console.warn(`[docs] Failed to fetch: ${url}`);
      continue;
    }

    const { title, body } = parseDocPage(raw, url);

    if (body.length < 50) {
      // Skip near-empty pages
      continue;
    }

    chunkMap.set(id, {
      id,
      type: 'doc',
      number: null,
      title,
      body,
      labels: ['documentation'],
      files: [],
      merged_at: null,
      author: 'rocket.chat',
      url: url.replace('.md', ''),
    });

    fetched++;
    console.log(`[docs] ✓ ${title}`);
    await new Promise((r) => setTimeout(r, 300));
  }

  // Step 5: Save and rebuild index
  const allChunks = Array.from(chunkMap.values());
  await fs.writeFile(CHUNKS_PATH, JSON.stringify(allChunks, null, 2), 'utf8');

  const indexed = await buildIndex();
  const result = { fetched, skipped, total: allChunks.length, indexed };
  console.log(`[docs] Done — ${JSON.stringify(result)}`);
  return result;
}