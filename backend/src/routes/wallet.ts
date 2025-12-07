import { Router } from 'express';
import { pool } from '../db/pool';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { EmployeeCard, DealMetrics, WalletSummary } from '@sotrudniki/shared';

const router = Router();

router.get('/card', authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const result = await pool.query('SELECT * FROM employee_cards WHERE user_id = $1', [userId]);
  if (result.rowCount === 0) {
    return res.json(null);
  }
  const row = result.rows[0];
  const card: EmployeeCard = {
    userId,
    position: row.position,
    responsibilities: row.responsibilities,
    skills: row.skills,
    activeStatus: row.active_status,
    statusHistory: row.status_history
  };
  res.json(card);
});

router.get('/deals', authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const result = await pool.query('SELECT * FROM deal_metrics WHERE user_id = $1', [userId]);
  if (result.rowCount === 0) {
    return res.json([]);
  }
  const metrics: DealMetrics[] = result.rows.map((row) => ({
    userId: row.user_id,
    averagePerPeak: Number(row.average_per_peak),
    totalVolume: Number(row.total_volume),
    lastUpdated: row.last_updated,
    role: row.role
  }));
  res.json(metrics);
});

router.get('/wallet', authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const result = await pool.query('SELECT * FROM wallet_summaries WHERE user_id = $1', [userId]);
  if (result.rowCount === 0) {
    return res.json(null);
  }
  const row = result.rows[0];
  const summary: WalletSummary = {
    userId,
    salaryToDate: Number(row.salary_to_date),
    hoursWorked: Number(row.hours_worked),
    position: row.position,
    lastPayrollDate: row.last_payroll_date,
    analyticsNotes: row.analytics_notes || undefined
  };
  res.json(summary);
});

export default router;
