import { List, ListRow } from '../components/ListRow';
import { PageHeader } from '../components/PageHeader';
import { SWAP_HINT } from '../data/plan';
import { formatDayDot, programWeek, WEEKDAY_SHORT, weekDays, weekdayOf } from '../domain/dates';
import { isDeloadWeek, workoutForDay } from '../domain/schedule';
import { dayStatus } from '../domain/streak';
import { DayStatusLabel } from '../features/week/DayStatusLabel';
import { statusLabel } from '../features/week/statusLabel';
import styles from '../features/week/Week.module.css';
import { useApp } from '../state/useApp';

export function WeekPage() {
  const { data, today } = useApp();
  const days = weekDays(today);
  const week = programWeek(data.settings.startDate, today);
  const deload = isDeloadWeek(data.settings.startDate, today);

  const subtitle = [
    week > 0 ? `Programmwoche ${week}` : null,
    deload ? 'leichte Woche: 2 Sätze pro Übung' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <PageHeader
        overline={`${formatDayDot(days[0])} bis ${formatDayDot(days[6])}`}
        title="Woche"
        subtitle={subtitle || undefined}
      />
      <List>
        {days.map((date) => {
          const workout = workoutForDay(data, date);
          const status = dayStatus(data, date, today);
          const isToday = date === today;
          const weekday = WEEKDAY_SHORT[weekdayOf(date)];
          return (
            <ListRow
              key={date}
              to={`/woche/${date}`}
              highlight={isToday}
              ariaLabel={`${isToday ? 'Heute, ' : ''}${weekday} ${formatDayDot(date)}: ${workout.name}, ${statusLabel(status)}`}
              leading={
                <span className={`${styles.dayBox} ${isToday ? styles.dayBoxToday : ''}`}>
                  <span className={styles.dayShort}>{weekday}</span>
                  <span className={`${styles.dayNum} num`}>{Number(date.slice(8))}</span>
                </span>
              }
              title={workout.name}
              meta={isToday ? 'Heute' : undefined}
              trailing={<DayStatusLabel status={status} />}
            />
          );
        })}
      </List>
      <p className={styles.hint}>{SWAP_HINT}</p>
    </>
  );
}
