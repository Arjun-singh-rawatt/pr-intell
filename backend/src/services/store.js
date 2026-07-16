import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');
const LOCAL_AUTH_USER_ID = 'local-dev-user';
const LOCAL_GITHUB_ID = 'dev-github-user';

export const DEFAULT_SETTINGS = {
  displayName: 'Alex Rivera',
  username: '@arivera_dev',
  darkMode: true,
  notifications: true,
};

export const DEFAULT_LOCAL_AUTH_USER = {
  id: LOCAL_AUTH_USER_ID,
  githubId: LOCAL_GITHUB_ID,
  username: 'github-user',
  displayName: 'GitHub User',
  avatarUrl: '',
  apiKeys: {},
};

export const DEFAULT_STORE = {
  settings: { ...DEFAULT_SETTINGS },
  bookmarks: { pr: {}, kb: {}, contributor: {} },
  auth: { devUser: { ...DEFAULT_LOCAL_AUTH_USER } },
};

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, `${JSON.stringify(DEFAULT_STORE, null, 2)}\n`, 'utf8');
  }
}

function normalizeApiKeys(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }

  const next = {};
  for (const [provider, value] of Object.entries(raw)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    if (!value.ciphertext || !value.iv || !value.authTag) continue;

    next[provider] = {
      ciphertext: String(value.ciphertext),
      iv: String(value.iv),
      authTag: String(value.authTag),
      updatedAt: value.updatedAt ? new Date(value.updatedAt).toISOString() : new Date().toISOString(),
    };
  }

  return next;
}

function normalizeLocalAuthUser(raw) {
  return {
    id: String(raw?.id || DEFAULT_LOCAL_AUTH_USER.id),
    githubId: String(raw?.githubId || DEFAULT_LOCAL_AUTH_USER.githubId),
    username: String(raw?.username || DEFAULT_LOCAL_AUTH_USER.username),
    displayName: String(raw?.displayName || DEFAULT_LOCAL_AUTH_USER.displayName),
    avatarUrl: String(raw?.avatarUrl || DEFAULT_LOCAL_AUTH_USER.avatarUrl),
    apiKeys: normalizeApiKeys(raw?.apiKeys),
  };
}

function normalizeStore(raw) {
  return {
    settings: { ...DEFAULT_SETTINGS, ...(raw.settings || {}) },
    bookmarks: {
      pr: { ...(raw.bookmarks?.pr || {}) },
      kb: { ...(raw.bookmarks?.kb || {}) },
      contributor: { ...(raw.bookmarks?.contributor || {}) },
    },
    auth: {
      devUser: normalizeLocalAuthUser(raw.auth?.devUser),
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

export async function getLocalAuthUser() {
  const store = await readStore();
  return store.auth.devUser;
}

export async function updateLocalAuthUser(patch) {
  const currentUser = await getLocalAuthUser();
  const nextUser = normalizeLocalAuthUser({
    ...currentUser,
    ...patch,
    apiKeys: patch?.apiKeys ?? currentUser.apiKeys,
  });

  const store = await writeStore((current) => ({
    ...current,
    auth: {
      ...current.auth,
      devUser: nextUser,
    },
  }));

  return store.auth.devUser;
}
