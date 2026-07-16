import mongoose from 'mongoose';

let databaseReady = false;

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI?.trim());
}

export function isDatabaseReady() {
  return databaseReady;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.warn('MongoDB disabled: MONGODB_URI is not set. Using local dev auth/key storage.');
    return false;
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  try {
    await mongoose.connect(uri);
    databaseReady = true;
    console.log('MongoDB connected');
    return true;
  } catch (err) {
    databaseReady = false;
    console.warn(`MongoDB disabled: ${err.message}. Falling back to local dev auth/key storage.`);
    return false;
  }
}
