

import bm25Factory from 'wink-bm25-text-search';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHUNKS_PATH = path.join(__dirname, '../../../data/kb_chunks.json');

let engine = null;
let indexedCount = 0;

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

export async function buildIndex() {
  let chunks = [];
  try {
    const raw = await fs.readFile(CHUNKS_PATH, 'utf8');
    chunks = JSON.parse(raw);
  } catch {
    chunks = [];
  }

  if (chunks.length === 0) {
    engine = null;
    indexedCount = 0;
    console.log('[bm25] No chunks yet — run POST /api/knowledge/scrape');
    return 0;
  }

  const eng = bm25Factory();
  eng.defineConfig({ fldWeights: { title: 3, body: 2, labels: 1, files: 1 } });
  eng.definePrepTasks([tokenize]);

  chunks.forEach((chunk, idx) => {
    eng.addDoc(
      {
        title: chunk.title || '',
        body: chunk.body || '',
        labels: (chunk.labels || []).join(' '),
        files: (chunk.files || []).join(' '),
      },
      idx
    );
  });

  eng.consolidate();
  engine = { eng, chunks };
  indexedCount = chunks.length;
  console.log(`[bm25] Index ready: ${chunks.length} chunks`);
  return chunks.length;
}

export function searchIndex(query, topK = 8) {
  if (!engine) return [];
  try {
    const results = engine.eng.search(query, topK);
    return results
      .filter(([, score]) => score > 0)
      .map(([docIdx, score]) => ({ ...engine.chunks[docIdx], _score: score }));
  } catch {
    return [];
  }
}

export function getIndexStats() {
  return { built: engine !== null, count: indexedCount };
}