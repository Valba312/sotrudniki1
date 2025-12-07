import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';
import walletRouter from './routes/wallet';
import { ensureSchema } from './db/pool';
import { env } from './config/env';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api', walletRouter);

const start = async () => {
  await ensureSchema();
  app.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
