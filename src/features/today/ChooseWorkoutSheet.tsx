import { Check } from 'lucide-react';
import { Sheet } from '../../components/Sheet';
import { icon } from '../../components/icon';
import { SWAP_HINT, WORKOUTS } from '../../data/plan';
import styles from './Today.module.css';

interface Props {
  open: boolean;
  currentId: string;
  plannedId: string;
  onChoose: (workoutId: string) => void;
  onClose: () => void;
}

const KIND_LABEL = { kraft: 'Kraft', aktiv: 'Aktiv', ruhe: 'Ruhe' } as const;

export function ChooseWorkoutSheet({ open, currentId, plannedId, onChoose, onClose }: Props) {
  return (
    <Sheet open={open} onClose={onClose} title="Anderes Training wählen">
      <p className={styles.sheetIntro}>{SWAP_HINT}</p>
      <ul className={styles.choiceList}>
        {WORKOUTS.map((w) => (
          <li key={w.id}>
            <button
              type="button"
              className={styles.choice}
              aria-pressed={w.id === currentId}
              onClick={() => onChoose(w.id)}
            >
              <span className={styles.choiceText}>
                <span className={styles.choiceName}>{w.name}</span>
                <span className={styles.meta}>
                  {KIND_LABEL[w.kind]}
                  {w.id === plannedId && ' · laut Plan heute'}
                </span>
              </span>
              {w.id === currentId && <Check {...icon} className={styles.choiceCheck} />}
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
