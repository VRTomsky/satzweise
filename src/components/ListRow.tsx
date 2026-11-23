import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { icon } from './icon';
import styles from './ListRow.module.css';

interface Props {
  to: string;
  title: ReactNode;
  meta?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  highlight?: boolean;
  ariaLabel?: string;
}

/** Zeile in einer Liste, die zu einer anderen Seite führt. */
export function ListRow({ to, title, meta, leading, trailing, highlight, ariaLabel }: Props) {
  return (
    <li className={styles.item}>
      <Link
        to={to}
        className={`${styles.row} ${highlight ? styles.highlight : ''}`}
        aria-label={ariaLabel}
        aria-current={highlight ? 'date' : undefined}
      >
        {leading && <span className={styles.leading}>{leading}</span>}
        <span className={styles.text}>
          <span className={styles.title}>{title}</span>
          {meta && <span className={styles.meta}>{meta}</span>}
        </span>
        {trailing && <span className={styles.trailing}>{trailing}</span>}
        <ChevronRight {...icon} className={styles.chevron} />
      </Link>
    </li>
  );
}

export function List({ children }: { children: ReactNode }) {
  return <ul className={styles.list}>{children}</ul>;
}
