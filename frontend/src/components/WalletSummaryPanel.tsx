import { WalletSummary } from '@sotrudniki/shared';

interface Props {
  wallet: WalletSummary;
}

export default function WalletSummaryPanel({ wallet }: Props) {
  return (
    <section className="panel">
      <h2>Кошелек баланса</h2>
      <div className="stat-grid">
        <div className="metric-card">
          <p className="label">Заработано</p>
          <p className="value">{wallet.salaryToDate.toLocaleString('ru-RU')} ₽</p>
        </div>
        <div className="metric-card">
          <p className="label">Отработано</p>
          <p className="value">{wallet.hoursWorked.toLocaleString('ru-RU')} ч</p>
        </div>
        <div className="metric-card">
          <p className="label">Позиция</p>
          <p className="value" style={{ fontSize: 16, lineHeight: 1.4 }}>{wallet.position}</p>
        </div>
        {wallet.projectedBonus && (
          <div className="metric-card">
            <p className="label">Прогноз премии</p>
            <p className="value">{wallet.projectedBonus.toLocaleString('ru-RU')} ₽</p>
          </div>
        )}
      </div>
      <p className="subtext">Последняя выплата: {new Date(wallet.lastPayrollDate).toLocaleDateString('ru-RU')}</p>
      {wallet.analyticsNotes && <p className="note">{wallet.analyticsNotes}</p>}
      <div className="actions">
        <button className="primary">Экспорт для бухучета</button>
        <button className="ghost">Скачать отчет</button>
      </div>
    </section>
  );
}
