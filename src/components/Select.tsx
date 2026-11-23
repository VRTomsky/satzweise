import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';
import styles from './Field.module.css';
import { iconSm } from './icon';

/** Auswahlfeld im App-Stil. */
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className={styles.selectWrap}>
      <select {...props} className={styles.input} />
      <ChevronDown {...iconSm} className={styles.selectIcon} />
    </span>
  );
}
