import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { iconSm } from './icon';
import styles from './NumberInput.module.css';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}

/** Zahl mit Minus- und Plus-Knopf. Die Zahl kann man auch direkt eintippen. */
export function Stepper({ value, onChange, label, min = 0, max = 999 }: StepperProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className={styles.stepper} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.stepButton}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label={`${label}: weniger`}
      >
        <Minus {...iconSm} />
      </button>
      <input
        className={`${styles.stepValue} num`}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        value={draft ?? String(value)}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const text = e.target.value.replace(/\D/g, '').slice(0, 3);
          setDraft(text);
          if (text !== '') onChange(clamp(Number(text)));
        }}
        onBlur={() => setDraft(null)}
      />
      <button
        type="button"
        className={styles.stepButton}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label={`${label}: mehr`}
      >
        <Plus {...iconSm} />
      </button>
    </div>
  );
}

interface DecimalProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  label: string;
  unit: string;
  id?: string;
  placeholder?: string;
}

/** Feld für Kommazahlen wie 10,5 kg. Leer lassen ist erlaubt. */
export function DecimalInput({ value, onChange, label, unit, id, placeholder }: DecimalProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = value === undefined ? '' : String(value).replace('.', ',');

  return (
    <span className={styles.decimal}>
      <input
        id={id}
        className={`${styles.decimalInput} num`}
        type="text"
        inputMode="decimal"
        aria-label={id ? undefined : label}
        placeholder={placeholder}
        value={draft ?? shown}
        onChange={(e) => {
          const text = e.target.value.replace(/[^\d,.]/g, '').slice(0, 6);
          setDraft(text);
          const parsed = Number(text.replace(',', '.'));
          onChange(text === '' || Number.isNaN(parsed) ? undefined : parsed);
        }}
        onBlur={() => setDraft(null)}
      />
      <span className={styles.unit} aria-hidden>
        {unit}
      </span>
    </span>
  );
}
