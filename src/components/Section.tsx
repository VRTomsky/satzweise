import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface Props {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}

/** Abschnitt mit Überschrift. Gruppiert Inhalte über Abstand statt über zusätzliche Rahmen. */
export function Section({ title, description, action, children }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {action}
      </div>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
