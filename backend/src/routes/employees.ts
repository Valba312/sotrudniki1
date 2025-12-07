import { Router } from 'express';
import { pool } from '../db/pool';
import { EmployeeSummary, DealMetrics, WalletSummary, EmployeeCard, Payout, DealDetail } from '@sotrudniki/shared';

const router = Router();

const parseId = (value: string) => Number.parseInt(value, 10);

router.get('/employees/:id/summary', async (req, res) => {
  const userId = parseId(req.params.id);
  const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (userResult.rowCount === 0) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  const user = userResult.rows[0];

  const cardResult = await pool.query('SELECT * FROM employee_cards WHERE user_id = $1', [userId]);
  const cardRow = cardResult.rows[0];
  const card: EmployeeCard | null = cardRow
    ? {
        userId,
        position: cardRow.position,
        responsibilities: cardRow.responsibilities,
        skills: cardRow.skills,
        activeStatus: cardRow.active_status,
        statusHistory: cardRow.status_history
      }
    : null;

  const dealsResult = await pool.query('SELECT * FROM deal_metrics WHERE user_id = $1 ORDER BY role ASC', [userId]);
  const deals: DealMetrics[] = dealsResult.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    averagePerPeak: Number(row.average_per_peak),
    totalVolume: Number(row.total_volume),
    lastUpdated: row.last_updated,
    role: row.role,
    accuracy: row.accuracy ? Number(row.accuracy) : undefined,
    revenueShare: row.revenue_share ? Number(row.revenue_share) : undefined
  }));

  const walletResult = await pool.query('SELECT * FROM wallet_summaries WHERE user_id = $1', [userId]);
  const walletRow = walletResult.rows[0];
  const wallet: WalletSummary | null = walletRow
    ? {
        userId,
        salaryToDate: Number(walletRow.salary_to_date),
        hoursWorked: Number(walletRow.hours_worked),
        position: walletRow.position,
        lastPayrollDate: walletRow.last_payroll_date,
        analyticsNotes: walletRow.analytics_notes || undefined,
        projectedBonus: walletRow.projected_bonus ? Number(walletRow.projected_bonus) : undefined
      }
    : null;

  if (!card || !wallet) {
    return res.status(404).json({ message: 'Employee profile incomplete' });
  }

  const summary: EmployeeSummary = {
    userId,
    fullName: user.full_name,
    position: wallet?.position || card?.position || 'Сотрудник',
    card,
    deals,
    wallet
  };

  res.json(summary);
});

router.get('/employees/:id/payouts', async (req, res) => {
  const userId = parseId(req.params.id);
  const result = await pool.query('SELECT * FROM payouts WHERE user_id = $1 ORDER BY payout_date DESC', [userId]);
  const payouts: Payout[] = result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    date: row.payout_date,
    amount: Number(row.amount),
    status: row.status,
    method: row.method || undefined,
    note: row.note || undefined
  }));
  res.json(payouts);
});

router.get('/employees/:id/deals', async (req, res) => {
  const userId = parseId(req.params.id);
  const result = await pool.query('SELECT * FROM deal_details WHERE user_id = $1 ORDER BY id DESC', [userId]);
  const details: DealDetail[] = result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    role: row.role,
    periodLabel: row.period_label,
    volume: Number(row.volume),
    averagePerPeak: Number(row.average_per_peak),
    accuracy: Number(row.accuracy),
    revenue: row.revenue ? Number(row.revenue) : undefined
  }));
  res.json(details);
});

export default router;
