import type { ReactNode } from 'react';
import styles from './Field.module.css';

interface Props {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}

/** Beschriftetes Eingabefeld. Das Feld selbst bekommt die Klasse `input` aus Field.module.css. */
export function Field({ label, htmlFor, hint, error, children }: Props) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
