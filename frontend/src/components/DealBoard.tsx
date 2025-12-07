import { DealMetrics } from '@sotrudniki/shared';

interface Props {
  deals: DealMetrics[];
}

const roleLabel: Record<DealMetrics['role'], string> = {
  receiver: 'Сделка приемщик',
  issuer: 'Сделка кладовщик'
};

export default function DealBoard({ deals }: Props) {
  return (
    <section className="panel">
      <h2>Показатели сделок</h2>
      <div className="stat-grid">
        {deals.map((deal) => (
          <div key={`${deal.role}-${deal.lastUpdated}`} className="metric-card">
            <div className="stat-header" style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
              <p className="pill secondary">{roleLabel[deal.role]}</p>
              <small>Обновлено: {new Date(deal.lastUpdated).toLocaleDateString('ru-RU')}</small>
            </div>
            <p className="label">Средняя ГП за пик</p>
            <p className="value">{deal.averagePerPeak.toLocaleString('ru-RU')} шт.</p>
            <p className="label">Итого ГП</p>
            <p className="value">{deal.totalVolume.toLocaleString('ru-RU')} шт.</p>
            {deal.accuracy && (
              <p className="label" style={{ marginTop: 8 }}>
                Точность учета: <strong>{deal.accuracy}%</strong>
              </p>
            )}
            {deal.revenueShare && (
              <p className="label">
                Доля выручки: <strong>{deal.revenueShare.toLocaleString('ru-RU')} ₽</strong>
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
