import { ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { iconSm } from '../../components/icon';
import { getExercise } from '../../data/exercises';
import type { IsoDate, PlannedExercise } from '../../data/types';
import { formatBench, formatRest, formatTarget } from '../../domain/format';
import { doneValues, lastSession, prefillValue, progressionHint } from '../../domain/progression';
import { primeAudio } from '../../services/sound';
import { createRestTimer } from '../timer/restTimer';
import { useApp } from '../../state/useApp';
import { SetRow } from './SetRow';
import styles from './Today.module.css';

interface Props {
  planned: PlannedExercise;
  workoutId: string;
  date: IsoDate;
  sets: number;
  onShowTips: () => void;
}

export function ExerciseItem({ planned, workoutId, date, sets, onShowTips }: Props) {
  const { data, dispatch } = useApp();
  const exercise = getExercise(planned.exerciseId);
  if (!exercise) return null;

  const todaySets = data.logs[date]?.sets[exercise.id] ?? [];
  const last = lastSession(data, exercise.id, date);
  const lastValues = last ? doneValues(last.sets) : [];
  const hint = progressionHint(planned, data, date, sets);
  const bench = formatBench(exercise.bench, data.settings.benchLevels, exercise.benchNote);
  const unit = planned.seconds ? 'Sekunden' : 'Wiederholungen';

  const toggle = (index: number, value: number) => {
    const wasDone = todaySets[index]?.done ?? false;
    dispatch({ type: 'set/toggle', date, exerciseId: exercise.id, index, value });
    if (!wasDone && planned.restSec > 0) {
      primeAudio();
      dispatch({ type: 'timer/start', timer: createRestTimer(planned.restSec, exercise.name) });
    }
  };

  return (
    <div className={styles.exercise}>
      <div className={styles.exerciseHead}>
        <span className={`${styles.badge} num`} aria-hidden>
          {planned.label}
        </span>
        <div className={styles.exerciseText}>
          <h3 className={styles.exerciseName}>
            <Link to={`/uebung/${exercise.id}?w=${workoutId}`} className={styles.exerciseLink}>
              <span className="visually-hidden">Übung {planned.label}: </span>
              {exercise.name}
              <ChevronRight {...iconSm} />
            </Link>
          </h3>
          <p className={`${styles.meta} num`}>
            {formatTarget(planned, exercise, sets)}
            {planned.tempo && <> · Tempo {planned.tempo}</>} · {formatRest(planned)}
          </p>
          <p className={styles.meta}>
            Start: {planned.startLoad}
            {bench && <> · Bank: {bench}</>}
          </p>
          {planned.note && <p className={styles.note}>{planned.note}</p>}
        </div>
      </div>

      <div className={styles.setHeader} aria-hidden>
        <span>Satz</span>
        <span>{unit}</span>
      </div>
      <ul className={styles.sets}>
        {Array.from({ length: sets }, (_, i) => {
          const value = prefillValue(planned, todaySets, last, i);
          return (
            <SetRow
              key={i}
              index={i}
              set={todaySets[i]}
              value={value}
              unit={unit}
              exerciseName={exercise.name}
              showWeight={data.settings.showWeightField}
              onToggle={() => toggle(i, value)}
              onValue={(v) =>
                dispatch({ type: 'set/value', date, exerciseId: exercise.id, index: i, value: v })
              }
              onWeight={(kg) =>
                dispatch({
                  type: 'set/weight',
                  date,
                  exerciseId: exercise.id,
                  index: i,
                  weightKg: kg,
                })
              }
            />
          );
        })}
      </ul>

      <div className={styles.footnotes}>
        <p className={`${styles.last} num`}>
          {lastValues.length > 0
            ? `Letztes Mal: ${lastValues.join(' · ')}`
            : 'Noch kein letztes Mal'}
        </p>
        {hint && (
          <button type="button" className={styles.hint} onClick={onShowTips}>
            <TrendingUp {...iconSm} />
            {hint === 'next-time' ? 'Nächstes Mal schwerer machen' : 'Diesmal schwerer machen'}
          </button>
        )}
      </div>
    </div>
  );
}
