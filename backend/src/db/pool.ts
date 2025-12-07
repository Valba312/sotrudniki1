import { Pool } from 'pg';
import { env } from '../config/env';

export const pool = new Pool({ connectionString: env.databaseUrl });

export const ensureSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS employee_cards (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      position TEXT NOT NULL,
      responsibilities TEXT[] NOT NULL,
      skills TEXT[] NOT NULL,
      active_status TEXT NOT NULL,
      status_history JSONB DEFAULT '[]'::jsonb
    );

    CREATE TABLE IF NOT EXISTS deal_metrics (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      average_per_peak NUMERIC NOT NULL,
      total_volume NUMERIC NOT NULL,
      last_updated TIMESTAMPTZ DEFAULT NOW(),
      role TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS wallet_summaries (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      salary_to_date NUMERIC NOT NULL,
      hours_worked NUMERIC NOT NULL,
      position TEXT NOT NULL,
      last_payroll_date TIMESTAMPTZ DEFAULT NOW(),
      analytics_notes TEXT
    );
  `);
};
