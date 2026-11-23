import { ExternalLink } from 'lucide-react';
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import buttonStyles from '../components/Button.module.css';
import { icon } from '../components/icon';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { getExercise } from '../data/exercises';
import { getWorkout, WORKOUTS } from '../data/plan';
import { formatBench, formatRest, formatTarget } from '../domain/format';
import { ExerciseImages } from '../features/exercise/ExerciseImages';
import styles from '../features/exercise/Exercise.module.css';
import { useApp } from '../state/useApp';

export function ExercisePage() {
  const { exerciseId = '' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useApp();

  const exercise = getExercise(exerciseId);
  if (!exercise) return <Navigate to="/" replace />;

  const workout =
    getWorkout(params.get('w') ?? '') ??
    WORKOUTS.find((w) => w.exercises.some((e) => e.exerciseId === exercise.id));
  const planned = workout?.exercises.find((e) => e.exerciseId === exercise.id);
  const bench = formatBench(exercise.bench, data.settings.benchLevels, exercise.benchNote);
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtubeQuery)}`;

  // Zurück zur Seite, von der du gekommen bist. Beim direkten Aufruf zur Startseite.
  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate('/'));

  const facts: [string, string][] = planned
    ? [
        ['Sätze', formatTarget(planned, exercise, planned.sets)],
        ...(planned.tempo ? [['Tempo', planned.tempo] as [string, string]] : []),
        ['Pause', formatRest(planned)],
        ['Start', planned.startLoad],
        ['Bank', bench ?? 'ohne Bank'],
      ]
    : [];

  return (
    <>
      <PageHeader
        back={{ label: 'Zurück', onClick: goBack }}
        overline={workout ? `${workout.name} · Übung ${planned?.label ?? ''}` : undefined}
        title={exercise.name}
        subtitle={exercise.primaryMuscles.join(', ')}
      />

      <ExerciseImages exercise={exercise} />

      {facts.length > 0 && (
        <dl className={styles.facts}>
          {facts.map(([term, value]) => (
            <div key={term} className={styles.fact}>
              <dt>{term}</dt>
              <dd className="num">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {planned?.note && <p className={styles.note}>{planned.note}</p>}

      <Section title="Ausführung">
        <ol className={styles.steps}>
          {exercise.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Section>

      <Section title="Häufige Fehler">
        <ul className={styles.mistakes}>
          {exercise.mistakes.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </Section>

      <div className={styles.video}>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.block}`}
        >
          <ExternalLink {...icon} />
          Video auf YouTube suchen
          <span className="visually-hidden"> (öffnet in neuem Tab)</span>
        </a>
      </div>
    </>
  );
}
