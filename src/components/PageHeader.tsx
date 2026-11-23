import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { icon } from './icon';
import styles from './PageHeader.module.css';

interface Props {
  title: string;
  overline?: string;
  subtitle?: ReactNode;
  back?: { to: string; label: string };
}

export function PageHeader({ title, overline, subtitle, back }: Props) {
  return (
    <header className={styles.header}>
      {back && (
        <Link to={back.to} className={styles.back}>
          <ChevronLeft {...icon} />
          {back.label}
        </Link>
      )}
      {overline && <p className={styles.overline}>{overline}</p>}
      <h1 className={styles.title} tabIndex={-1}>
        {title}
      </h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
