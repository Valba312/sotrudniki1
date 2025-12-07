import { Router } from 'express';
import { pool } from '../db/pool';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Post } from '@sotrudniki/shared';

const router = Router();

router.get('/', authMiddleware, async (_req, res) => {
  const result = await pool.query('SELECT id, user_id, title, body, created_at FROM posts ORDER BY created_at DESC');
  const posts: Post[] = result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    createdAt: row.created_at
  }));
  res.json(posts);
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  const { title, body } = req.body;
  const userId = req.user!.id;
  const result = await pool.query(
    'INSERT INTO posts (user_id, title, body) VALUES ($1, $2, $3) RETURNING id, user_id, title, body, created_at',
    [userId, title, body]
  );
  const post: Post = {
    id: result.rows[0].id,
    userId,
    title,
    body,
    createdAt: result.rows[0].created_at
  };
  res.status(201).json(post);
});

export default router;
