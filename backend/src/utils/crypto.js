import crypto from 'crypto';

const ALGO = 'aes-256-gcm';

function getKey() {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length < 64) throw new Error('ENCRYPTION_KEY must be 32 bytes hex (64 chars)');
  return Buffer.from(hex.slice(0, 64), 'hex');
}

export function encrypt(plaintext) {
  const iv = crypto.randomBytes(12);          // 96-bit IV for GCM
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Store as iv:authTag:ciphertext — all hex
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(stored) {
  const [ivHex, authTagHex, cipherHex] = stored.split(':');
  const iv       = Buffer.from(ivHex, 'hex');
  const authTag  = Buffer.from(authTagHex, 'hex');
  const cipher   = Buffer.from(cipherHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(cipher), decipher.final()]).toString('utf8');
}

export function randomToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Mask key for display: show first 4 + last 4 chars only
export function maskKey(plaintext) {
  if (plaintext.length <= 8) return '••••••••';
  return `${plaintext.slice(0, 4)}${'•'.repeat(8)}${plaintext.slice(-4)}`;
}