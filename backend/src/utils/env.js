/** Placeholder values from .env.example — must not be sent to external APIs. */
const PLACEHOLDER_PATTERNS = [
  /^your[_-]/i,
  /x{4,}/i,
  /placeholder/i,
  /^replace[-_]?me/i,
  /^changeme/i,
];

/**
 * True when an env var is set to a real value (not empty / example placeholder).
 */
export function isConfiguredEnv(name, value = process.env[name]) {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  return !PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmed));
}
