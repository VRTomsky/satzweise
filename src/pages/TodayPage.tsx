import { CalendarClock, CircleCheck, Info, CirclePause } from 'lucide-react';
import { useState } from 'react';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { icon } from '../components/icon';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';
import { Sheet } from '../components/Sheet';
import { PROGRESSION } from '../data/basics';
import { SWAP_HINT } from '../data/plan';
import type { Workout } from '../data/types';
import { formatLong } from '../domain/dates';
import {
  groupExercises,
  isDeloadWeek,
  plannedWorkout,
  setsFor,
  totalSets,
  workoutForDay,
} from '../domain/schedule';
import { BasicsBlocks } from '../features/basics/BasicsContent';
import { ChooseWorkoutSheet } from '../features/today/ChooseWorkoutSheet';
import { ExerciseItem } from '../features/today/ExerciseItem';
import styles from '../features/today/Today.module.css';
import { Warmup } from '../features/today/Warmup';
import { useWakeLock } from '../services/wakeLock';
import { useApp } from '../state/useApp';

function subtitleFor(workout: Workout): string {
  if (workout.kind === 'kraft') return `${workout.exercises.length} Übungen · ca. 60 Minuten`;
  if (workout.kind === 'aktiv') return 'Lockere Bewegung';
  return 'Erholung';
}

const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

export function TodayPage() {
  const { data, dispatch, today } = useApp();
  const [choosing, setChoosing] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const workout = workoutForDay(data, today);
  const planned = plannedWorkout(data.settings, today);
  const log = data.logs[today];
  const completed = Boolean(log?.completedAt);
  const paused = Boolean(log?.paused);
  const isStrength = workout.kind === 'kraft';
  const deload = isStrength && isDeloadWeek(data.settings.startDate, today);

  const total = totalSets(workout, deload);
  const done = workout.exercises.reduce((sum, ex) => {
    const sets = log?.sets[ex.exerciseId] ?? [];
    return sum + sets.slice(0, setsFor(ex, deload)).filter((s) => s.done).length;
  }, 0);
  const started = done > 0 || Boolean(log?.warmup.some(Boolean));

  useWakeLock(isStrength && started && !completed && !paused);

  const complete = () => {
    dispatch({ type: 'day/complete', date: today, at: new Date().toISOString() });
    dispatch({ type: 'timer/stop' });
    setConfirmOpen(false);
  };

  const onFinish = () => (done < total ? setConfirmOpen(true) : complete());

  return (
    <>
      <PageHeader
        overline={formatLong(today)}
        title={workout.name}
        subtitle={
          workout.id !== planned.id
            ? `${subtitleFor(workout)} · getauscht, laut Plan: ${planned.name}`
            : subtitleFor(workout)
        }
      />

      <div className={styles.stack}>
        {paused && (
          <Card className={styles.status}>
            <CirclePause {...icon} className={styles.statusIcon} />
            <div className={styles.statusText}>
              <p className={styles.statusTitle}>Heute pausiert</p>
              <p className={styles.meta}>Deine Serie läuft weiter. Gute Erholung.</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => dispatch({ type: 'day/pause', date: today, paused: false })}
            >
              Aufheben
            </Button>
          </Card>
        )}

        {completed && log?.completedAt && (
          <Card className={styles.status}>
            <CircleCheck {...icon} className={styles.statusIconDone} />
            <div className={styles.statusText}>
              <p className={styles.statusTitle}>
                {isStrength ? 'Training abgeschlossen' : 'Erledigt'}
              </p>
              <p className={`${styles.meta} num`}>
                um {timeOf(log.completedAt)} Uhr
                {isStrength && ` · ${done} von ${total} Sätzen`}
              </p>
            </div>
            <Button variant="ghost" onClick={() => dispatch({ type: 'day/reopen', date: today })}>
              Wieder öffnen
            </Button>
          </Card>
        )}

        {deload && !paused && (
          <Banner icon={<CalendarClock {...icon} />}>
            <strong>Leichte Woche.</strong> Diese Woche nur 2 Sätze pro Übung. So erholt sich dein
            Körper und du kommst danach stärker zurück.
          </Banner>
        )}

        {!paused && isStrength && (
          <>
            <div className={styles.progress}>
              <p className={`${styles.progressText} num`} aria-live="polite">
                <strong>{done}</strong> von {total} Sätzen
              </p>
              <ProgressBar value={done} max={total} label="Erledigte Sätze" />
            </div>

            {workout.warmup && <Warmup date={today} />}

            {groupExercises(workout.exercises).map((group) => (
              <Card key={group[0].label} as="section" className={styles.group}>
                {group.length > 1 && (
                  <p className={styles.superset}>
                    Supersatz {group.map((g) => g.label).join(' + ')}: im Wechsel, Pause erst nach
                    dem Paar
                  </p>
                )}
                {group.map((ex) => (
                  <ExerciseItem
                    key={ex.exerciseId}
                    planned={ex}
                    workoutId={workout.id}
                    date={today}
                    sets={setsFor(ex, deload)}
                    onShowTips={() => setTipsOpen(true)}
                  />
                ))}
              </Card>
            ))}

            {!completed && (
              <Button variant="primary" block onClick={onFinish}>
                Training abschließen
              </Button>
            )}
          </>
        )}

        {!paused && !isStrength && (
          <>
            <Card>
              <p>{workout.description}</p>
              {workout.kind === 'aktiv' && (
                <p className={`${styles.meta} ${styles.spaced}`}>
                  <Info {...icon} size={16} className={styles.inlineIcon} />
                  {SWAP_HINT}
                </p>
              )}
            </Card>
            {!completed && (
              <Button variant="primary" block onClick={complete}>
                Erledigt
              </Button>
            )}
          </>
        )}

        {!completed && !paused && (
          <div className={styles.secondary}>
            <Button variant="ghost" onClick={() => setChoosing(true)}>
              Anderes Training wählen
            </Button>
            <Button
              variant="ghost"
              onClick={() => dispatch({ type: 'day/pause', date: today, paused: true })}
            >
              Heute pausieren
            </Button>
          </div>
        )}
      </div>

      <ChooseWorkoutSheet
        open={choosing}
        currentId={workout.id}
        plannedId={planned.id}
        onClose={() => setChoosing(false)}
        onChoose={(id) => {
          dispatch({ type: 'day/choose', date: today, workoutId: id });
          setChoosing(false);
        }}
      />

      <Sheet open={tipsOpen} onClose={() => setTipsOpen(false)} title="Schwerer machen">
        <BasicsBlocks section={PROGRESSION} />
      </Sheet>

      <ConfirmDialog
        open={confirmOpen}
        title="Training abschließen?"
        confirmLabel="Trotzdem abschließen"
        onConfirm={complete}
        onCancel={() => setConfirmOpen(false)}
      >
        <p className="num">
          Noch {total - done} von {total} Sätzen offen. Das Training zählt trotzdem als erledigt.
        </p>
      </ConfirmDialog>
    </>
  );
}
