// PATH: pr-intel/backend/src/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import prRoutes from './routes/prs.js';
import settingsRoutes from './routes/settings.js';
import bookmarkRoutes from './routes/bookmarks.js';
import kbRoutes from './routes/kb.js';
import contributorRoutes from './routes/contributors.js';
import searchRoutes from './routes/search.js';
import knowledgeRoutes from './routes/knowledge.js';
import { isConfiguredEnv } from './utils/env.js';
import { buildIndex } from './utils/rag/bm25.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/api/prs', prRoutes);
app.use('/api/user/settings', settingsRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/kb', kbRoutes);
app.use('/api/contributors', contributorRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/knowledge', knowledgeRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    github: isConfiguredEnv('GITHUB_TOKEN') ? 'authenticated' : 'anonymous',
    gemini: isConfiguredEnv('GEMINI_API_KEY') ? 'configured' : 'missing',
  });
});

async function start() {
  const indexed = await buildIndex();

  app.listen(PORT, () => {
    const github = isConfiguredEnv('GITHUB_TOKEN') ? 'token set' : 'anonymous (60 req/hr)';
    const gemini = isConfiguredEnv('GEMINI_API_KEY')
      ? '✓ Gemini Flash'
      : '✗ missing — get free key at aistudio.google.com';

    console.log(`\n🚀 PR Intel → http://localhost:${PORT}`);
    console.log(`   GitHub  → ${github}`);
    console.log(`   Gemini  → ${gemini}`);
    console.log(`   KB      → ${indexed} chunks in BM25 index`);

    if (indexed === 0) {
      console.log('\n   No knowledge base yet.');
      console.log('   POST http://localhost:5000/api/knowledge/scrape');
      console.log('   Body: { "pages": 10 }  ← fetches ~200 Rocket.Chat PRs\n');
    } else {
      console.log('   ✓ RAG ready\n');
    }
  });
}

start().catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});