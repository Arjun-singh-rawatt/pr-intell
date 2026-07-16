import User from '../models/User.js';
import { isDatabaseReady } from '../db.js';
import { getLocalAuthUser, updateLocalAuthUser } from './store.js';

export const SUPPORTED_KEY_PROVIDERS = ['gemini', 'groq', 'openrouter'];

const DEV_GITHUB_ID = 'dev-github-user';

function normalizeApiKeys(apiKeys) {
  if (!apiKeys || typeof apiKeys !== 'object' || Array.isArray(apiKeys)) {
    return {};
  }
  return apiKeys;
}

export function serializeUserForClient(user) {
  if (!user) return null;

  return {
    id: user._id ? user._id.toString() : String(user.id),
    githubId: user.githubId || DEV_GITHUB_ID,
    username: user.username || 'github-user',
    displayName: user.displayName || user.username || 'GitHub User',
    avatarUrl: user.avatarUrl || '',
  };
}

export async function findUserById(userId) {
  if (!userId) return null;

  if (isDatabaseReady()) {
    return User.findById(userId);
  }

  const user = await getLocalAuthUser();
  return user.id === String(userId) ? user : null;
}

export async function getOrCreateGithubUser() {
  if (isDatabaseReady()) {
    let user = await User.findOne({ githubId: DEV_GITHUB_ID });
    if (!user) {
      user = await User.create({
        githubId: DEV_GITHUB_ID,
        username: 'github-user',
        displayName: 'GitHub User',
        avatarUrl: '',
        apiKeys: {},
      });
    }
    return user;
  }

  return getLocalAuthUser();
}

export async function getUserApiKeys(user) {
  if (!user) return {};
  return normalizeApiKeys(user.apiKeys);
}

export async function saveUserApiKey(user, provider, encryptedKey) {
  if (isDatabaseReady()) {
    user.apiKeys = {
      ...normalizeApiKeys(user.apiKeys),
      [provider]: encryptedKey,
    };
    await user.save();
    return user;
  }

  const current = await getLocalAuthUser();
  return updateLocalAuthUser({
    apiKeys: {
      ...normalizeApiKeys(current.apiKeys),
      [provider]: encryptedKey,
    },
  });
}

export async function deleteUserApiKey(user, provider) {
  if (isDatabaseReady()) {
    const next = {
      ...normalizeApiKeys(user.apiKeys),
    };
    delete next[provider];
    user.apiKeys = next;
    await user.save();
    return user;
  }

  const current = await getLocalAuthUser();
  const next = {
    ...normalizeApiKeys(current.apiKeys),
  };
  delete next[provider];
  return updateLocalAuthUser({ apiKeys: next });
}
