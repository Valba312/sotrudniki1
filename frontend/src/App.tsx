import EmployeeCard from './components/EmployeeCard';
import DealBoard from './components/DealBoard';
import WalletSummaryPanel from './components/WalletSummaryPanel';
import { EmployeeCard as EmployeeCardType, DealMetrics, WalletSummary } from '@sotrudniki/shared';

const mockCard: EmployeeCardType = {
  userId: 1,
  position: 'Кладовщик / приемщик',
  responsibilities: ['Прием грузо-партий', 'Выдача ГП по смене', 'Участие в ревизии'],
  skills: ['1C', 'Excel', 'Обмен данными с ТСД'],
  activeStatus: 'hired',
  statusHistory: [
    { timestamp: '2024-01-15T10:00:00Z', status: 'hired', note: 'Принят на склад №3' },
    { timestamp: '2024-02-10T08:00:00Z', status: 'on_leave', note: 'Отпуск 3 дня' },
    { timestamp: '2024-02-13T08:00:00Z', status: 'hired', note: 'Выход из отпуска' }
  ]
};

const mockDeals: DealMetrics[] = [
  {
    userId: 1,
    averagePerPeak: 125,
    totalVolume: 1890,
    lastUpdated: '2024-03-01T10:00:00Z',
    role: 'receiver'
  },
  {
    userId: 1,
    averagePerPeak: 118,
    totalVolume: 1720,
    lastUpdated: '2024-03-01T10:00:00Z',
    role: 'issuer'
  }
];

const mockWallet: WalletSummary = {
  userId: 1,
  salaryToDate: 245000,
  hoursWorked: 980,
  position: 'Старший кладовщик',
  lastPayrollDate: '2024-03-05T09:00:00Z',
  analyticsNotes: 'Пиковая нагрузка в феврале: прирост +12% к средней приемке'
};

function App() {
  return (
    <div className="layout">
      <header>
        <h1>Цифровой кошелек сотрудника</h1>
        <p>
          Единая SPA-витрина для карточки сотрудника, сделок приемщика/кладовщика и баланса заработной платы.
        </p>
      </header>
      <main>
        <div className="grid">
          <EmployeeCard card={mockCard} />
          <WalletSummaryPanel wallet={mockWallet} />
          <DealBoard deals={mockDeals} />
        </div>
      </main>
    </div>
  );
}

export default App;
