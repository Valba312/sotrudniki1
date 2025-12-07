import { Router } from 'express';
import { pool } from '../db/pool';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User } from '@sotrudniki/shared';

const router = Router();

router.get('/', authMiddleware, async (_req, res) => {
  const result = await pool.query('SELECT id, email, full_name, role, created_at FROM users ORDER BY id DESC');
  const users: User[] = result.rows.map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    passwordHash: '',
    createdAt: row.created_at
  }));
  res.json(users);
});

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const result = await pool.query('SELECT id, email, full_name, role, created_at FROM users WHERE id = $1', [userId]);
  const row = result.rows[0];
  const user: User = {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    passwordHash: '',
    createdAt: row.created_at
  };
  res.json(user);
});

export default router;
