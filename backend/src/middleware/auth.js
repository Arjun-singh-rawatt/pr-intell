import { findActiveSessionByToken, findUserById } from '../db/authStore.js';

/**
 * requireAuth — protects routes that need a logged-in user.
 * Reads the session token from the httpOnly cookie `prsession`.
 * Attaches req.user (User doc) and req.session (Session doc).
 */
export async function requireAuth(req, res, next) {
  const token = req.cookies?.prsession;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const session = await findActiveSessionByToken(token);
    if (!session) return res.status(401).json({ error: 'Session expired or invalid' });

    const user = await findUserById(session.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * optionalAuth — same as requireAuth but doesn't block if not logged in.
 * Useful for routes that behave differently when authenticated.
 */
export async function optionalAuth(req, _res, next) {
  const token = req.cookies?.prsession;
  if (!token) return next();

  try {
    const session = await findActiveSessionByToken(token);
    if (session) {
      const user = await findUserById(session.userId);
      if (user) { req.user = user; req.session = session; }
    }
  } catch { /* ignore auth errors for optional */ }
  next();
}
