import { useId, type ReactNode } from 'react';
import styles from './Toggle.module.css';

interface Props {
  label: string;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Schalter für An/Aus-Einstellungen. */
export function Toggle({ label, description, checked, onChange }: Props) {
  const descId = useId();
  return (
    <div className={styles.row}>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description && (
          <span id={descId} className={styles.description}>
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-describedby={description ? descId : undefined}
        className={styles.switch}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.thumb} />
      </button>
    </div>
  );
}
