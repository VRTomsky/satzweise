import { Check } from 'lucide-react';
import { DecimalInput, Stepper } from '../../components/NumberInput';
import type { SetLog } from '../../data/types';
import styles from './Today.module.css';

interface Props {
  index: number;
  set: SetLog | undefined;
  value: number;
  unit: 'Wiederholungen' | 'Sekunden';
  exerciseName: string;
  showWeight: boolean;
  onToggle: () => void;
  onValue: (value: number) => void;
  onWeight: (kg: number | undefined) => void;
}

/** Ein Satz: großes Abhak-Feld plus vorbelegte Wiederholungen (und optional Gewicht). */
export function SetRow({
  index,
  set,
  value,
  unit,
  exerciseName,
  showWeight,
  onToggle,
  onValue,
  onWeight,
}: Props) {
  const done = set?.done ?? false;
  const number = index + 1;

  return (
    <li className={`${styles.setRow} ${done ? styles.setDone : ''}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={`${exerciseName}, Satz ${number} erledigt`}
        className={styles.check}
        onClick={onToggle}
      >
        {done ? (
          <Check size={22} strokeWidth={2.25} aria-hidden />
        ) : (
          <span className="num">{number}</span>
        )}
      </button>
      <span className={`${styles.setLabel} ${showWeight ? 'visually-hidden' : ''}`}>
        Satz {number}
      </span>
      <span className={styles.setInputs}>
        <Stepper value={value} onChange={onValue} label={`${unit} Satz ${number}`} />
        {showWeight && (
          <DecimalInput
            value={set?.weightKg}
            onChange={onWeight}
            label={`Gewicht Satz ${number}`}
            unit="kg"
          />
        )}
      </span>
    </li>
  );
}
