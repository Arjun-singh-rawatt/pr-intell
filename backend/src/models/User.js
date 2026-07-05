// PATH: pr-intel/backend/src/models/User.js

import mongoose from 'mongoose';

const encryptedKeySchema = new mongoose.Schema(
  {
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    displayName: { type: String },
    avatarUrl: { type: String },
    apiKeys: {
      gemini: { type: encryptedKeySchema, default: undefined },
      groq: { type: encryptedKeySchema, default: undefined },
      openrouter: { type: encryptedKeySchema, default: undefined },
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);