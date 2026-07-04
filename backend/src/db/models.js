import mongoose from 'mongoose';

// ── User ─────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  githubId:  { type: String, required: true, unique: true },
  username:  { type: String, required: true },       // GitHub login
  avatarUrl: { type: String, default: '' },
  email:     { type: String, default: '' },
  displayName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// ── Session ───────────────────────────────────────────
// Short-lived, one row per login. Simpler to revoke than pure JWT.
const sessionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token:     { type: String, required: true, unique: true },  // random opaque token
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete expired

// ── UserApiKey ────────────────────────────────────────
// Per-user, per-provider, AES-256-GCM encrypted at rest.
const userApiKeySchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, required: true },   // 'gemini' | 'groq' | 'openrouter' etc.
  // encrypted payload: iv:authTag:ciphertext (all hex, colon-separated)
  encryptedKey: { type: String, required: true },
  addedAt:  { type: Date, default: Date.now },
  lastUsedAt: { type: Date },
});
userApiKeySchema.index({ userId: 1, provider: 1 }, { unique: true });

export const User       = mongoose.model('User', userSchema);
export const Session    = mongoose.model('Session', sessionSchema);
export const UserApiKey = mongoose.model('UserApiKey', userApiKeySchema);