import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import EmployeeCard from './components/EmployeeCard';
import DealBoard from './components/DealBoard';
import WalletSummaryPanel from './components/WalletSummaryPanel';
import { DealDetail, EmployeeSummary, Payout } from '@sotrudniki/shared';
import { fetchDealDetails, fetchPayouts, fetchSummary } from './api';

const formatMoney = (value: number) => value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const formatDate = (value: string) => new Date(value).toLocaleDateString('ru-RU');

function DashboardPage({ summary, loading, error, onRefresh }: { summary: EmployeeSummary | null; loading: boolean; error: string | null; onRefresh: () => void }) {
  if (loading) return <div className="loading">Загружаем дашборд...</div>;
  if (error) return (
    <div className="error">
      Ошибка при загрузке: {error}
      <br />
      <button onClick={onRefresh}>Повторить</button>
    </div>
  );
  if (!summary) return null;

  return (
    <div className="grid">
      <EmployeeCard card={summary.card} />
      <WalletSummaryPanel wallet={summary.wallet} />
      <DealBoard deals={summary.deals} />
    </div>
  );
}

function PayoutsPage({ payouts, loading, error, onRefresh }: { payouts: Payout[]; loading: boolean; error: string | null; onRefresh: () => void }) {
  if (loading) return <div className="loading">Подгружаем историю выплат...</div>;
  if (error) return (
    <div className="error">
      Не удалось загрузить выплаты: {error}
      <br />
      <button onClick={onRefresh}>Повторить</button>
    </div>
  );

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>История выплат</h2>
        <button className="primary" onClick={onRefresh}>
          Обновить
        </button>
      </div>
      <table className="table-card">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Метод</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout) => (
            <tr key={payout.id}>
              <td>{formatDate(payout.date)}</td>
              <td>{formatMoney(payout.amount)}</td>
              <td>
                <span
                  className={`badge ${payout.status === 'paid' ? 'success' : payout.status === 'pending' ? 'pending' : 'failed'}`}
                >
                  {payout.status === 'paid' && 'Выплачено'}
                  {payout.status === 'pending' && 'В обработке'}
                  {payout.status === 'failed' && 'Ошибка'}
                </span>
              </td>
              <td>{payout.method || '—'}</td>
              <td>{payout.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function DealsPage({ details, loading, error, onRefresh }: { details: DealDetail[]; loading: boolean; error: string | null; onRefresh: () => void }) {
  if (loading) return <div className="loading">Загружаем сделки...</div>;
  if (error) return (
    <div className="error">
      Не удалось загрузить сделки: {error}
      <br />
      <button onClick={onRefresh}>Повторить</button>
    </div>
  );
  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Показатели сделок</h2>
        <button className="primary" onClick={onRefresh}>
          Обновить
        </button>
      </div>
      <div className="placeholder-grid">
        {details.map((detail) => (
          <div key={detail.id} className="placeholder-card">
            <p className="pill secondary" style={{ marginBottom: 10 }}>{detail.role === 'receiver' ? 'Сделка приемщик' : 'Сделка кладовщик'}</p>
            <p className="subtext" style={{ marginTop: 0 }}>{detail.periodLabel}</p>
            <p className="label">Объем</p>
            <p className="value">{detail.volume.toLocaleString('ru-RU')} шт.</p>
            <p className="label">Средняя за пик</p>
            <p className="value">{detail.averagePerPeak.toLocaleString('ru-RU')} шт.</p>
            <p className="label">Точность</p>
            <p className="value">{detail.accuracy}%</p>
            {detail.revenue && (
              <p className="label">
                Выручка: <strong>{formatMoney(detail.revenue)}</strong>
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ReportsPage() {
  return (
    <section className="panel">
      <h2>Отчёты в разработке</h2>
      <p className="subtext">Финансовые и HR-отчеты появятся здесь. Подготовили примеры карточек для будущих разделов.</p>
      <div className="placeholder-grid">
        <div className="placeholder-card">Командная эффективность (подготовка)</div>
        <div className="placeholder-card">Отчёты по переработкам (макет)</div>
        <div className="placeholder-card">Сводка по KPI склада (драфт)</div>
      </div>
    </section>
  );
}

function App() {
  const [summary, setSummary] = useState<EmployeeSummary | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [dealDetails, setDealDetails] = useState<DealDetail[]>([]);
  const [loading, setLoading] = useState({ summary: true, payouts: true, deals: true });
  const [error, setError] = useState<{ summary: string | null; payouts: string | null; deals: string | null }>({
    summary: null,
    payouts: null,
    deals: null
  });

  const loadSummary = async () => {
    setLoading((state) => ({ ...state, summary: true }));
    setError((state) => ({ ...state, summary: null }));
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (err) {
      setError((state) => ({ ...state, summary: err instanceof Error ? err.message : 'Ошибка' }));
    } finally {
      setLoading((state) => ({ ...state, summary: false }));
    }
  };

  const loadPayouts = async () => {
    setLoading((state) => ({ ...state, payouts: true }));
    setError((state) => ({ ...state, payouts: null }));
    try {
      const data = await fetchPayouts();
      setPayouts(data);
    } catch (err) {
      setError((state) => ({ ...state, payouts: err instanceof Error ? err.message : 'Ошибка' }));
    } finally {
      setLoading((state) => ({ ...state, payouts: false }));
    }
  };

  const loadDeals = async () => {
    setLoading((state) => ({ ...state, deals: true }));
    setError((state) => ({ ...state, deals: null }));
    try {
      const data = await fetchDealDetails();
      setDealDetails(data);
    } catch (err) {
      setError((state) => ({ ...state, deals: err instanceof Error ? err.message : 'Ошибка' }));
    } finally {
      setLoading((state) => ({ ...state, deals: false }));
    }
  };

  useEffect(() => {
    loadSummary();
    loadPayouts();
    loadDeals();
  }, []);

  const navItems = useMemo(
    () => [
      { to: '/dashboard', label: 'Дашборд' },
      { to: '/payouts', label: 'Выплаты' },
      { to: '/deals', label: 'Сделки' },
      { to: '/reports', label: 'Отчёты' }
    ],
    []
  );

  return (
    <BrowserRouter>
      <div className="layout">
        <div className="page-shell">
          <header>
            <h1>Цифровой кошелёк сотрудника</h1>
            <p>Карточка, сделки, выплаты и аналитика в едином интерфейсе — аккуратный UI и реальные данные с бэкенда.</p>
          </header>

          <nav className="nav">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Routes>
            <Route
              path="/dashboard"
              element={<DashboardPage summary={summary} loading={loading.summary} error={error.summary} onRefresh={loadSummary} />}
            />
            <Route
              path="/payouts"
              element={<PayoutsPage payouts={payouts} loading={loading.payouts} error={error.payouts} onRefresh={loadPayouts} />}
            />
            <Route
              path="/deals"
              element={<DealsPage details={dealDetails} loading={loading.deals} error={error.deals} onRefresh={loadDeals} />}
            />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
