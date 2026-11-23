import { ImageOff } from 'lucide-react';
import type { Exercise } from '../../data/types';
import styles from './Exercise.module.css';

const CAPTIONS = ['Start', 'Ende'];

/** Start- und Endposition. Ohne Bild ein schlichter Platzhalter. */
export function ExerciseImages({ exercise }: { exercise: Exercise }) {
  if (exercise.images.length === 0) {
    return (
      <div className={styles.placeholder} role="img" aria-label={`Kein Bild für ${exercise.name}`}>
        <ImageOff size={28} strokeWidth={1.5} aria-hidden />
        <span>{exercise.name}</span>
      </div>
    );
  }

  return (
    <figure className={styles.figure}>
      <div className={styles.images}>
        {exercise.images.map((src, i) => (
          <div key={src} className={styles.imageWrap}>
            <img
              src={`${import.meta.env.BASE_URL}${src}`}
              alt={`${exercise.name}: ${i === 0 ? 'Startposition' : 'Endposition'}`}
              width={640}
              height={427}
              loading="lazy"
              decoding="async"
              className={styles.image}
            />
            <span className={styles.caption} aria-hidden>
              {CAPTIONS[i] ?? ''}
            </span>
          </div>
        ))}
      </div>
      <figcaption className={styles.credit}>Bilder: free-exercise-db (Public Domain)</figcaption>
    </figure>
  );
}
