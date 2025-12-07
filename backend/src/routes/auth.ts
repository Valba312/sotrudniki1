import { Router } from 'express';
import { pool } from '../db/pool';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { AuthTokens } from '@sotrudniki/shared';

const router = Router();

const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password: string, stored: string) => {
  const [salt, hash] = stored.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

router.post('/register', async (req, res) => {
  const { email, password, fullName, role } = req.body;
  if (!email || !password || !fullName || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const passwordHash = hashPassword(password);

  const result = await pool.query(
    'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role, full_name, created_at',
    [email, passwordHash, fullName, role]
  );

  const user = result.rows[0];
  const tokens: AuthTokens = {
    accessToken: jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    })
  };

  res.status(201).json({ user, tokens });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (userResult.rowCount === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const user = userResult.rows[0];
  if (!verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const tokens: AuthTokens = {
    accessToken: jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    })
  };

  res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      createdAt: user.created_at
    },
    tokens
  });
});

export default router;
