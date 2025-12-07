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
      <div className="cards">
        {deals.map((deal) => (
          <div key={`${deal.role}-${deal.lastUpdated}`} className="stat">
            <div className="stat-header">
              <p className="pill secondary">{roleLabel[deal.role]}</p>
              <small>Обновлено: {new Date(deal.lastUpdated).toLocaleString('ru-RU')}</small>
            </div>
            <div className="stat-grid">
              <div>
                <p className="label">Средняя ГП за пик</p>
                <p className="value">{deal.averagePerPeak.toLocaleString('ru-RU')} шт.</p>
              </div>
              <div>
                <p className="label">Итого ГП</p>
                <p className="value">{deal.totalVolume.toLocaleString('ru-RU')} шт.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
