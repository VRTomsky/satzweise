import styles from './Segmented.module.css';

interface Props<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/** Umschalter zwischen wenigen Ansichten, z. B. Gewicht / Bauchumfang. */
export function Segmented<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div className={styles.segmented} role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={styles.option}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
