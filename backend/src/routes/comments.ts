import { Router } from 'express';
import { pool } from '../db/pool';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Comment } from '@sotrudniki/shared';

const router = Router();

router.get('/post/:postId', authMiddleware, async (req, res) => {
  const result = await pool.query('SELECT id, post_id, user_id, body, created_at FROM comments WHERE post_id = $1', [
    req.params.postId
  ]);
  const comments: Comment[] = result.rows.map((row) => ({
    id: row.id,
    postId: row.post_id,
    userId: row.user_id,
    body: row.body,
    createdAt: row.created_at
  }));
  res.json(comments);
});

router.post('/post/:postId', authMiddleware, async (req: AuthRequest, res) => {
  const { body } = req.body;
  const postId = Number(req.params.postId);
  const userId = req.user!.id;
  const result = await pool.query(
    'INSERT INTO comments (post_id, user_id, body) VALUES ($1, $2, $3) RETURNING id, post_id, user_id, body, created_at',
    [postId, userId, body]
  );
  const comment: Comment = {
    id: result.rows[0].id,
    postId,
    userId,
    body,
    createdAt: result.rows[0].created_at
  };
  res.status(201).json(comment);
});

export default router;
