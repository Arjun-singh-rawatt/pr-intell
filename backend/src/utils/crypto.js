import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV is the GCM recommendation

function getKey() {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('ENCRYPTION_KEY is not set in .env');
  }
  const key = Buffer.from(raw, 'hex');
  if (key.length !== 32) {
    throw new Error(
      `ENCRYPTION_KEY must be 32 bytes (64 hex chars). Got ${key.length} bytes — regenerate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
    );
  }
  return key;
}

/**
 * Encrypts a plaintext string. Returns ciphertext + iv + authTag, all base64.
 * All three MUST be stored together — losing the iv or authTag makes the
 * ciphertext permanently undecryptable.
 */
export function encrypt(plaintext) {
  if (typeof plaintext !== 'string' || !plaintext.length) {
    throw new Error('encrypt() requires a non-empty string');
  }
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

/**
 * Decrypts a { ciphertext, iv, authTag } record back into the original string.
 * Throws if the authTag doesn't match (tampering or wrong key).
 */
export function decrypt(record) {
  if (!record || !record.ciphertext || !record.iv || !record.authTag) {
    throw new Error('decrypt() requires { ciphertext, iv, authTag }');
  }
  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(record.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(record.authTag, 'base64'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(record.ciphertext, 'base64')),
    decipher.final(),
  ]);
  return plaintext.toString('utf8');
}

/**
 * Returns a display-safe masked version of a raw key, e.g. "sk-a••••9f3k".
 * Never send the full key back to the client after it's been stored.
 */
export function maskKey(rawKey) {
  if (!rawKey || rawKey.length < 8) return '••••••••';
  return `${rawKey.slice(0, 4)}••••${rawKey.slice(-4)}`;
}