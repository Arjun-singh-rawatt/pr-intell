import mongoose from 'mongoose';
import { isConfiguredEnv } from '../utils/env.js';

let connected = false;
let connectionState = {
  connected: false,
  status: 'idle',
  reason: null,
  hint: null,
};

function buildMongoHint(uri, message) {
  if (uri.startsWith('mongodb+srv://') && /querySrv .*ECONNREFUSED/i.test(message)) {
    return 'DNS SRV lookup failed for this Atlas URI. Use the standard mongodb:// connection string from Atlas, or a local MongoDB URI, if your network blocks SRV records.';
  }
  return null;
}

export async function connectDB() {
  if (connected) return { ...connectionState };

  const uri = process.env.MONGODB_URI?.trim() || '';
  if (!isConfiguredEnv('MONGODB_URI', uri)) {
    console.warn('[DB] MongoDB disabled: MONGODB_URI missing or placeholder');
    connectionState = {
      connected: false,
      status: 'disabled',
      reason: 'MONGODB_URI missing or placeholder',
      hint: null,
    };
    return { ...connectionState };
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    connected = true;
    connectionState = {
      connected: true,
      status: 'connected',
      reason: null,
      hint: null,
    };
    console.log('[DB] MongoDB connected');
    return { ...connectionState };
  } catch (err) {
    connected = false;
    const message = err?.message || 'Unknown MongoDB error';
    const hint = buildMongoHint(uri, message);
    connectionState = {
      connected: false,
      status: 'failed',
      reason: message,
      hint,
    };
    console.error(`[DB] MongoDB connection failed: ${message}`);
    if (hint) console.error(`[DB] ${hint}`);
    return { ...connectionState };
  }
}

export function isConnected() {
  return connected;
}

export function getConnectionState() {
  return { ...connectionState };
}
