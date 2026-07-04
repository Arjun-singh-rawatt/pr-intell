import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Session, User, UserApiKey } from './models.js';
import { isConnected } from './mongoose.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const STORE_PATH = path.join(DATA_DIR, 'auth-store.json');

const DEFAULT_STORE = {
  users: [],
  sessions: [],
  apiKeys: [],
};

function makeId() {
  return crypto.randomUUID();
}

function toIso(value, fallback = new Date()) {
  if (!value) return fallback.toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback.toISOString() : date.toISOString();
}

function normalizeStore(raw) {
  const now = Date.now();
  const users = Array.isArray(raw?.users) ? raw.users : [];
  const sessions = Array.isArray(raw?.sessions) ? raw.sessions : [];
  const apiKeys = Array.isArray(raw?.apiKeys) ? raw.apiKeys : [];

  return {
    users: users.map((user) => ({
      _id: String(user._id || makeId()),
      githubId: String(user.githubId || ''),
      username: user.username || '',
      avatarUrl: user.avatarUrl || '',
      email: user.email || '',
      displayName: user.displayName || '',
      createdAt: toIso(user.createdAt),
    })),
    sessions: sessions
      .map((session) => ({
        _id: String(session._id || makeId()),
        userId: String(session.userId || ''),
        token: session.token || '',
        expiresAt: toIso(session.expiresAt),
        createdAt: toIso(session.createdAt),
      }))
      .filter((session) => session.userId && session.token && new Date(session.expiresAt).getTime() > now),
    apiKeys: apiKeys.map((row) => ({
      _id: String(row._id || makeId()),
      userId: String(row.userId || ''),
      provider: row.provider || '',
      encryptedKey: row.encryptedKey || '',
      addedAt: toIso(row.addedAt),
      lastUsedAt: row.lastUsedAt ? toIso(row.lastUsedAt) : null,
    })),
  };
}

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, `${JSON.stringify(DEFAULT_STORE, null, 2)}\n`, 'utf8');
  }
}

async function readStore() {
  await ensureStore();
  const raw = JSON.parse(await fs.readFile(STORE_PATH, 'utf8'));
  return normalizeStore(raw);
}

async function writeStore(updater) {
  const current = await readStore();
  const next = normalizeStore(typeof updater === 'function' ? updater(current) : updater);
  await fs.writeFile(STORE_PATH, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  return next;
}

function cloneRecord(record) {
  return record ? { ...record } : null;
}

export function getAuthStorageMode() {
  return isConnected() ? 'mongo' : 'file';
}

export async function findUserByGitHubId(githubId) {
  if (isConnected()) {
    return User.findOne({ githubId: String(githubId) }).lean();
  }
  const store = await readStore();
  return cloneRecord(store.users.find((user) => user.githubId === String(githubId)));
}

export async function findUserById(userId) {
  if (isConnected()) {
    return User.findById(userId).lean();
  }
  const store = await readStore();
  return cloneRecord(store.users.find((user) => user._id === String(userId)));
}

export async function createUser(data) {
  if (isConnected()) {
    const user = await User.create(data);
    return user.toObject();
  }

  const user = {
    _id: makeId(),
    githubId: String(data.githubId),
    username: data.username,
    avatarUrl: data.avatarUrl || '',
    email: data.email || '',
    displayName: data.displayName || '',
    createdAt: toIso(data.createdAt),
  };

  await writeStore((store) => ({
    ...store,
    users: [...store.users, user],
  }));

  return user;
}

export async function updateUser(userId, patch) {
  if (isConnected()) {
    return User.findByIdAndUpdate(userId, patch, { new: true, lean: true });
  }

  let updatedUser = null;
  await writeStore((store) => ({
    ...store,
    users: store.users.map((user) => {
      if (user._id !== String(userId)) return user;
      updatedUser = { ...user, ...patch };
      return updatedUser;
    }),
  }));
  return cloneRecord(updatedUser);
}

export async function createSession(data) {
  if (isConnected()) {
    const session = await Session.create(data);
    return session.toObject();
  }

  const session = {
    _id: makeId(),
    userId: String(data.userId),
    token: data.token,
    expiresAt: toIso(data.expiresAt),
    createdAt: toIso(data.createdAt),
  };

  await writeStore((store) => ({
    ...store,
    sessions: [...store.sessions, session],
  }));

  return session;
}

export async function findActiveSessionByToken(token) {
  if (isConnected()) {
    return Session.findOne({ token, expiresAt: { $gt: new Date() } }).lean();
  }
  const store = await readStore();
  return cloneRecord(store.sessions.find((session) => session.token === token));
}

export async function deleteSessionByToken(token) {
  if (isConnected()) {
    return Session.deleteOne({ token });
  }

  let deleted = 0;
  await writeStore((store) => {
    const sessions = store.sessions.filter((session) => {
      const keep = session.token !== token;
      if (!keep) deleted += 1;
      return keep;
    });
    return { ...store, sessions };
  });
  return { deletedCount: deleted };
}

export async function listUserApiKeys(userId) {
  if (isConnected()) {
    return UserApiKey.find({ userId }).lean();
  }
  const store = await readStore();
  return store.apiKeys
    .filter((row) => row.userId === String(userId))
    .map((row) => ({ ...row }));
}

export async function findUserApiKey(userId, provider) {
  if (isConnected()) {
    return UserApiKey.findOne({ userId, provider }).lean();
  }
  const store = await readStore();
  return cloneRecord(
    store.apiKeys.find((row) => row.userId === String(userId) && row.provider === provider)
  );
}

export async function upsertUserApiKey(userId, provider, encryptedKey) {
  if (isConnected()) {
    return UserApiKey.findOneAndUpdate(
      { userId, provider },
      { encryptedKey, addedAt: new Date() },
      { upsert: true, new: true, lean: true }
    );
  }

  let result = null;
  await writeStore((store) => {
    const rows = [...store.apiKeys];
    const index = rows.findIndex(
      (row) => row.userId === String(userId) && row.provider === provider
    );

    if (index >= 0) {
      rows[index] = {
        ...rows[index],
        encryptedKey,
        addedAt: toIso(new Date()),
      };
      result = rows[index];
    } else {
      result = {
        _id: makeId(),
        userId: String(userId),
        provider,
        encryptedKey,
        addedAt: toIso(new Date()),
        lastUsedAt: null,
      };
      rows.push(result);
    }

    return { ...store, apiKeys: rows };
  });

  return cloneRecord(result);
}

export async function deleteUserApiKey(userId, provider) {
  if (isConnected()) {
    return UserApiKey.deleteOne({ userId, provider });
  }

  let deleted = 0;
  await writeStore((store) => {
    const apiKeys = store.apiKeys.filter((row) => {
      const keep = !(row.userId === String(userId) && row.provider === provider);
      if (!keep) deleted += 1;
      return keep;
    });
    return { ...store, apiKeys };
  });
  return { deletedCount: deleted };
}
