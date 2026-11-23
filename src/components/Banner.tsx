import type { ReactNode } from 'react';
import styles from './Banner.module.css';

interface Props {
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}

/** Dezenter Hinweis oben auf einer Seite. */
export function Banner({ icon, children, action }: Props) {
  return (
    <div className={styles.banner} role="status">
      <span className={styles.icon}>{icon}</span>
      <div className={styles.text}>{children}</div>
      {action}
    </div>
  );
}
