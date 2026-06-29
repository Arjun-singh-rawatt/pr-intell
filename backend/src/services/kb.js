import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_PATH = path.join(__dirname, '../../data/kb-documents.json');

let cache = null;

async function loadDocuments() {
  if (cache) return cache;
  const raw = await fs.readFile(KB_PATH, 'utf8');
  cache = JSON.parse(raw);
  return cache;
}

export async function listKbDocuments(search = '') {
  const docs = await loadDocuments();
  const q = search.trim().toLowerCase();
  if (!q) return docs;

  return docs.filter((doc) => {
    const haystack = [doc.title, doc.snippet, ...(doc.tags || [])].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

export async function getKbDocument(docId) {
  const docs = await loadDocuments();
  return docs.find((doc) => doc.id === docId) || null;
}

export async function matchRelatedDocs({ title = '', body = '', labels = [] }) {
  const docs = await loadDocuments();
  const labelNames = labels.map((l) => (typeof l === 'string' ? l : l.name)).join(' ');
  const text = `${title} ${body} ${labelNames}`.toLowerCase();

  const scored = docs
    .map((doc) => {
      let score = 0;
      for (const tag of doc.tags || []) {
        if (text.includes(tag.toLowerCase())) score += 2;
      }
      const words = doc.title.toLowerCase().split(/\W+/).filter(Boolean);
      for (const word of words) {
        if (word.length > 3 && text.includes(word)) score += 1;
      }
      return { doc, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return scored.map(({ doc, score }) => ({
    id: doc.id,
    title: doc.title,
    url: doc.url,
    snippet: doc.snippet,
    relevance: score,
  }));
}
