import { Pool } from 'pg';
import { env } from '../config/env';
import { EmployeeCard, WalletSummary, DealMetrics, Payout, DealDetail } from '@sotrudniki/shared';

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

    DROP TABLE IF EXISTS deal_metrics;
    DROP TABLE IF EXISTS wallet_summaries;
    DROP TABLE IF EXISTS employee_cards;
    DROP TABLE IF EXISTS payouts;
    DROP TABLE IF EXISTS deal_details;

    CREATE TABLE employee_cards (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      position TEXT NOT NULL,
      responsibilities TEXT[] NOT NULL,
      skills TEXT[] NOT NULL,
      active_status TEXT NOT NULL,
      status_history JSONB DEFAULT '[]'::jsonb
    );

    CREATE TABLE deal_metrics (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      average_per_peak NUMERIC NOT NULL,
      total_volume NUMERIC NOT NULL,
      last_updated TIMESTAMPTZ DEFAULT NOW(),
      role TEXT NOT NULL,
      accuracy NUMERIC,
      revenue_share NUMERIC
    );

    CREATE TABLE wallet_summaries (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      salary_to_date NUMERIC NOT NULL,
      hours_worked NUMERIC NOT NULL,
      position TEXT NOT NULL,
      last_payroll_date TIMESTAMPTZ DEFAULT NOW(),
      analytics_notes TEXT,
      projected_bonus NUMERIC
    );

    CREATE TABLE payouts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      payout_date TIMESTAMPTZ NOT NULL,
      amount NUMERIC NOT NULL,
      status TEXT NOT NULL,
      method TEXT,
      note TEXT
    );

    CREATE TABLE deal_details (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      period_label TEXT NOT NULL,
      volume NUMERIC NOT NULL,
      average_per_peak NUMERIC NOT NULL,
      accuracy NUMERIC NOT NULL,
      revenue NUMERIC
    );
  `);

  await seedDemoData();
};

const seedDemoData = async () => {
  const userResult = await pool.query('SELECT id FROM users WHERE email = $1', ['worker@example.com']);
  let userId = userResult.rows[0]?.id as number | undefined;

  if (!userId) {
    const created = await pool.query(
      "INSERT INTO users (email, password_hash, full_name, role) VALUES ('worker@example.com', 'demo', 'Алина Кузнецова', 'employee') RETURNING id"
    );
    userId = created.rows[0].id;
  }

  const card: EmployeeCard = {
    userId,
    position: 'Кладовщик / приемщик',
    responsibilities: ['Прием грузо-партий', 'Выдача ГП по смене', 'Участие в ревизии'],
    skills: ['1C', 'Excel', 'ТСД'],
    activeStatus: 'hired',
    statusHistory: [
      { timestamp: '2024-01-15T10:00:00Z', status: 'hired', note: 'Принят на склад №3' },
      { timestamp: '2024-02-10T08:00:00Z', status: 'on_leave', note: 'Отпуск 3 дня' },
      { timestamp: '2024-02-13T08:00:00Z', status: 'hired', note: 'Выход из отпуска' }
    ]
  };

  await pool.query(
    `INSERT INTO employee_cards (user_id, position, responsibilities, skills, active_status, status_history)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id) DO UPDATE SET position = EXCLUDED.position, responsibilities = EXCLUDED.responsibilities, skills = EXCLUDED.skills, active_status = EXCLUDED.active_status, status_history = EXCLUDED.status_history`,
    [card.userId, card.position, card.responsibilities, card.skills, card.activeStatus, JSON.stringify(card.statusHistory)]
  );

  const wallet: WalletSummary = {
    userId,
    salaryToDate: 245000,
    hoursWorked: 980,
    position: 'Старший кладовщик',
    lastPayrollDate: '2024-03-05T09:00:00Z',
    analyticsNotes: 'Пиковая нагрузка в феврале: прирост +12% к средней приемке',
    projectedBonus: 18000
  };

  await pool.query(
    `INSERT INTO wallet_summaries (user_id, salary_to_date, hours_worked, position, last_payroll_date, analytics_notes, projected_bonus)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id) DO UPDATE SET salary_to_date = EXCLUDED.salary_to_date, hours_worked = EXCLUDED.hours_worked, position = EXCLUDED.position, last_payroll_date = EXCLUDED.last_payroll_date, analytics_notes = EXCLUDED.analytics_notes, projected_bonus = EXCLUDED.projected_bonus`,
    [wallet.userId, wallet.salaryToDate, wallet.hoursWorked, wallet.position, wallet.lastPayrollDate, wallet.analyticsNotes, wallet.projectedBonus]
  );

  const deals: DealMetrics[] = [
    {
      userId,
      role: 'receiver',
      averagePerPeak: 125,
      totalVolume: 1890,
      accuracy: 97,
      revenueShare: 32000,
      lastUpdated: '2024-03-01T10:00:00Z'
    },
    {
      userId,
      role: 'issuer',
      averagePerPeak: 118,
      totalVolume: 1720,
      accuracy: 95,
      revenueShare: 28400,
      lastUpdated: '2024-03-01T10:00:00Z'
    }
  ];

  await pool.query('DELETE FROM deal_metrics WHERE user_id = $1', [userId]);
  for (const metric of deals) {
    await pool.query(
      `INSERT INTO deal_metrics (user_id, average_per_peak, total_volume, last_updated, role, accuracy, revenue_share)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [metric.userId, metric.averagePerPeak, metric.totalVolume, metric.lastUpdated, metric.role, metric.accuracy, metric.revenueShare]
    );
  }

  const payouts: Payout[] = [
    { id: 1, userId, date: '2024-02-28T09:00:00Z', amount: 82000, status: 'paid', method: 'Банк', note: 'Премия за февраль' },
    { id: 2, userId, date: '2024-02-15T09:00:00Z', amount: 61000, status: 'paid', method: 'Банк' },
    { id: 3, userId, date: '2024-01-31T09:00:00Z', amount: 79000, status: 'paid', method: 'Банк', note: 'Итого январь' },
    { id: 4, userId, date: '2024-03-15T09:00:00Z', amount: 45000, status: 'pending', method: 'Банк', note: 'Частичная выплата за март' }
  ];

  await pool.query('DELETE FROM payouts WHERE user_id = $1', [userId]);
  for (const payout of payouts) {
    await pool.query(
      `INSERT INTO payouts (user_id, payout_date, amount, status, method, note)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, payout.date, payout.amount, payout.status, payout.method || null, payout.note || null]
    );
  }

  const dealDetails: DealDetail[] = [
    {
      id: 1,
      userId,
      role: 'receiver',
      periodLabel: 'Пик февраль (неделя 2)',
      volume: 520,
      averagePerPeak: 130,
      accuracy: 98,
      revenue: 11200
    },
    {
      id: 2,
      userId,
      role: 'issuer',
      periodLabel: 'Пик февраль (неделя 2)',
      volume: 490,
      averagePerPeak: 122,
      accuracy: 95,
      revenue: 10200
    },
    {
      id: 3,
      userId,
      role: 'receiver',
      periodLabel: 'Пик февраль (неделя 4)',
      volume: 610,
      averagePerPeak: 128,
      accuracy: 96,
      revenue: 12800
    }
  ];

  await pool.query('DELETE FROM deal_details WHERE user_id = $1', [userId]);
  for (const detail of dealDetails) {
    await pool.query(
      `INSERT INTO deal_details (user_id, role, period_label, volume, average_per_peak, accuracy, revenue)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, detail.role, detail.periodLabel, detail.volume, detail.averagePerPeak, detail.accuracy, detail.revenue || null]
    );
  }
};
