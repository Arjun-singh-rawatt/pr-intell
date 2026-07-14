import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const USERS_PATH = path.join(DATA_DIR, 'users.json');

async function ensureUsersFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_PATH);
  } catch {
    await fs.writeFile(USERS_PATH, '[]\n', 'utf8');
  }
}

async function readUsers() {
  await ensureUsersFile();
  const raw = await fs.readFile(USERS_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeUsers(users) {
  await ensureUsersFile();
  await fs.writeFile(USERS_PATH, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
}

function createId() {
  return `user_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

class UserModel {
  constructor(doc) {
    Object.assign(this, doc);
  }

  async save() {
    const users = await readUsers();
    const index = users.findIndex((entry) => entry._id === this._id);

    if (index === -1) {
      users.push({ ...this.toJSON() });
    } else {
      users[index] = { ...users[index], ...this.toJSON() };
    }

    await writeUsers(users);
    return this;
  }

  toJSON() {
    return {
      _id: this._id,
      githubId: this.githubId,
      email: this.email,
      name: this.name,
      apiKeys: this.apiKeys || {},
      createdAt: this.createdAt || new Date().toISOString(),
    };
  }
}

async function findById(userId) {
  const users = await readUsers();
  const match = users.find((entry) => entry._id === String(userId));
  return match ? new UserModel(match) : null;
}

async function findOne(query = {}) {
  const users = await readUsers();
  const match = users.find((entry) => {
    return Object.entries(query).every(([key, value]) => entry[key] === value);
  });
  return match ? new UserModel(match) : null;
}

async function create(payload = {}) {
  const user = new UserModel({
    _id: payload._id || createId(),
    ...payload,
    createdAt: payload.createdAt || new Date().toISOString(),
  });
  await user.save();
  return user;
}

export default {
  findById,
  findOne,
  create,
};
