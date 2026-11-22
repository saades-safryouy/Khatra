const express = require('express');
const { getPool } = require('../db');
const { signToken, verifyPassword, requireAuth } = require('../auth');

const router = express.Router();

function publicUser(row) {
  return { id: row.id, email: row.email, role: row.role };
}

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Bad request', message: 'email and password are required' });
    }
    const [rows] = await getPool().query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }
    const token = signToken(user);
    return res.json({ data: { token, user: publicUser(user) } });
  } catch (err) { return next(err); }
});

// GET /auth/me
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await getPool().query(
      'SELECT id, email, role FROM users WHERE id = ? LIMIT 1', [req.user.id]
    );
    if (!rows[0]) return res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
    return res.json({ data: { user: publicUser(rows[0]) } });
  } catch (err) { return next(err); }
});

// POST /auth/logout (stateless JWT — the client clears the token)
router.post('/logout', requireAuth, (_req, res) => res.json({ data: { ok: true } }));

module.exports = router;
