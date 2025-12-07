import { EmployeeCard } from '@sotrudniki/shared';

interface Props {
  card: EmployeeCard;
}

const statusLabels: Record<EmployeeCard['activeStatus'], string> = {
  hired: 'В работе',
  on_leave: 'Отсутствует',
  terminated: 'Уволен'
};

export default function EmployeeCardPanel({ card }: Props) {
  return (
    <section className="panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h2>Карточка сотрудника</h2>
          <p className="subtext">{card.position}</p>
        </div>
        <p className="pill">{statusLabels[card.activeStatus]}</p>
      </div>

      <div className="chips">
        {card.skills.map((skill) => (
          <span key={skill} className="chip">
            {skill}
          </span>
        ))}
      </div>

      <h3 className="section-title">Обязанности</h3>
      <ul className="list">
        {card.responsibilities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h3 className="section-title">История статусов</h3>
      <ul className="history">
        {card.statusHistory.map((status) => (
          <li key={status.timestamp}>
            <strong>{new Date(status.timestamp).toLocaleDateString('ru-RU')}</strong> — {status.status}
            {status.note ? ` (${status.note})` : ''}
          </li>
        ))}
      </ul>
    </section>
  );
}
