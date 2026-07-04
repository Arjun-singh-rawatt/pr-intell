import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import { getAuthStorageMode } from './db/authStore.js';
import { connectDB } from './db/mongoose.js';
import { buildIndex } from './utils/rag/bm25.js';
import { isConfiguredEnv } from './utils/env.js';

import authRoutes from './routes/auth.js';
import prRoutes from './routes/prs.js';
import settingsRoutes from './routes/settings.js';
import bookmarkRoutes from './routes/bookmarks.js';
import kbRoutes from './routes/kb.js';
import contributorRoutes from './routes/contributors.js';
import searchRoutes from './routes/search.js';
import knowledgeRoutes from './routes/knowledge.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/prs', prRoutes);
app.use('/api/user/settings', settingsRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/kb', kbRoutes);
app.use('/api/contributors', contributorRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/knowledge', knowledgeRoutes);

app.get('/ping', (_req, res) => res.send('OK'));
app.get('/api/health', (_req, res) => {
  const authStorage = getAuthStorageMode();
  res.json({
    status: 'ok',
    mongodb: authStorage === 'mongo' ? 'connected' : 'unavailable',
    authStorage,
  });
});

async function start() {
  const db = await connectDB();
  const indexed = await buildIndex();
  app.listen(PORT, () => {
    const mongoLabel =
      db.status === 'connected'
        ? 'connected'
        : 'unavailable (using local file fallback)';
    const authStorageLabel =
      getAuthStorageMode() === 'mongo' ? 'MongoDB' : 'local file fallback';

    console.log(`\nPR Intel -> http://localhost:${PORT}`);
    console.log(`   MongoDB  -> ${mongoLabel}`);
    if (db.hint) console.log(`               ${db.hint}`);
    console.log(
      `   Auth     -> ${isConfiguredEnv('GITHUB_CLIENT_ID') ? `GitHub OAuth ready (${authStorageLabel})` : 'GITHUB_CLIENT_ID missing'}`
    );
    console.log(`   KB       -> ${indexed} chunks\n`);
  });
}

start().catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});
