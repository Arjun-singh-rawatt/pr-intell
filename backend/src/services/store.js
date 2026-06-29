import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

export const DEFAULT_SETTINGS = {
  displayName: 'Alex Rivera',
  username: '@arivera_dev',
  darkMode: true,
  notifications: true,
};

export const DEFAULT_STORE = {
  settings: { ...DEFAULT_SETTINGS },
  bookmarks: { pr: {}, kb: {}, contributor: {} },
};

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, `${JSON.stringify(DEFAULT_STORE, null, 2)}\n`, 'utf8');
  }
}

function normalizeStore(raw) {
  return {
    settings: { ...DEFAULT_SETTINGS, ...(raw.settings || {}) },
    bookmarks: {
      pr: { ...(raw.bookmarks?.pr || {}) },
      kb: { ...(raw.bookmarks?.kb || {}) },
      contributor: { ...(raw.bookmarks?.contributor || {}) },
    },
  };
}

export async function readStore() {
  await ensureStore();
  const raw = JSON.parse(await fs.readFile(STORE_PATH, 'utf8'));
  return normalizeStore(raw);
}

export async function writeStore(updater) {
  const current = await readStore();
  const next = normalizeStore(typeof updater === 'function' ? updater(current) : updater);
  await fs.writeFile(STORE_PATH, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  return next;
}

export async function getSettings() {
  const store = await readStore();
  return store.settings;
}

export async function updateSettings(patch) {
  return writeStore((store) => ({
    ...store,
    settings: { ...store.settings, ...patch },
  }));
}

export async function listBookmarks(type) {
  const store = await readStore();
  if (type && store.bookmarks[type]) {
    return Object.values(store.bookmarks[type]);
  }
  return [
    ...Object.values(store.bookmarks.pr),
    ...Object.values(store.bookmarks.kb),
    ...Object.values(store.bookmarks.contributor),
  ];
}

export async function upsertBookmark(type, id, record) {
  return writeStore((store) => ({
    ...store,
    bookmarks: {
      ...store.bookmarks,
      [type]: {
        ...store.bookmarks[type],
        [String(id)]: {
          ...record,
          id: String(id),
          type,
          savedAt: record.savedAt || new Date().toISOString(),
        },
      },
    },
  }));
}

export async function removeBookmark(type, id) {
  return writeStore((store) => {
    const bucket = { ...store.bookmarks[type] };
    delete bucket[String(id)];
    return {
      ...store,
      bookmarks: { ...store.bookmarks, [type]: bucket },
    };
  });
}
