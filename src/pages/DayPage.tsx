import { Link, Navigate, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { List, ListRow } from '../components/ListRow';
import { PageHeader } from '../components/PageHeader';
import buttonStyles from '../components/Button.module.css';
import { getExercise } from '../data/exercises';
import { formatLong, isIsoDate } from '../domain/dates';
import { formatRest, formatTarget } from '../domain/format';
import { doneValues } from '../domain/progression';
import { isDeloadWeek, setsFor, workoutForDay } from '../domain/schedule';
import { dayStatus } from '../domain/streak';
import { statusLabel } from '../features/week/statusLabel';
import styles from '../features/week/Week.module.css';
import { useApp } from '../state/useApp';

export function DayPage() {
  const { date = '' } = useParams();
  const { data, today } = useApp();
  if (!isIsoDate(date)) return <Navigate to="/woche" replace />;

  const workout = workoutForDay(data, date);
  const status = dayStatus(data, date, today);
  const log = data.logs[date];
  const deload = workout.kind === 'kraft' && isDeloadWeek(data.settings.startDate, date);

  return (
    <>
      <PageHeader
        back={{ to: '/woche', label: 'Woche' }}
        overline={formatLong(date)}
        title={workout.name}
        subtitle={statusLabel(status)}
      />

      {workout.kind === 'kraft' ? (
        <List>
          {workout.exercises.map((planned) => {
            const exercise = getExercise(planned.exerciseId);
            if (!exercise) return null;
            const values = doneValues(log?.sets[exercise.id] ?? []);
            return (
              <ListRow
                key={planned.exerciseId}
                to={`/uebung/${exercise.id}?w=${workout.id}`}
                leading={<span className={`${styles.badge} num`}>{planned.label}</span>}
                title={exercise.name}
                meta={
                  <span className="num">
                    {values.length > 0
                      ? `Geschafft: ${values.join(' · ')}`
                      : `${formatTarget(planned, exercise, setsFor(planned, deload))} · ${formatRest(planned)}`}
                  </span>
                }
              />
            );
          })}
        </List>
      ) : (
        <Card>
          <p className={styles.description}>{workout.description}</p>
        </Card>
      )}

      {date === today && (
        <div className={styles.actions}>
          <Link
            to="/"
            className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.block}`}
          >
            Zum heutigen Training
          </Link>
        </div>
      )}
    </>
  );
}
