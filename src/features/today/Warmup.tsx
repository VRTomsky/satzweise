import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../../components/Card';
import { icon } from '../../components/icon';
import { WARMUP_STEPS } from '../../data/plan';
import type { IsoDate } from '../../data/types';
import { useApp } from '../../state/useApp';
import styles from './Today.module.css';

/** Abhakbare Mini-Checkliste fürs Aufwärmen (freiwillig). */
export function Warmup({ date }: { date: IsoDate }) {
  const { data, dispatch } = useApp();
  const checked = data.logs[date]?.warmup ?? [];
  const doneCount = WARMUP_STEPS.filter((_, i) => checked[i]).length;
  const allDone = doneCount === WARMUP_STEPS.length;
  const [open, setOpen] = useState(!allDone);

  return (
    <Card className={styles.warmup}>
      <button
        type="button"
        className={styles.warmupToggle}
        aria-expanded={open}
        aria-controls="warmup-list"
        onClick={() => setOpen(!open)}
      >
        <span className={styles.warmupTitle}>
          <span>Aufwärmen</span>
          <span className={`${styles.meta} num`}>
            ca. 6 Min · {doneCount} von {WARMUP_STEPS.length}
          </span>
        </span>
        <ChevronDown {...icon} className={open ? styles.chevronOpen : styles.chevron} />
      </button>
      {open && (
        <ul id="warmup-list" className={styles.warmupList}>
          {WARMUP_STEPS.map((step, i) => (
            <li key={step}>
              <button
                type="button"
                role="checkbox"
                aria-checked={Boolean(checked[i])}
                className={styles.warmupItem}
                onClick={() => dispatch({ type: 'warmup/toggle', date, index: i })}
              >
                <span className={styles.smallCheck}>
                  {checked[i] && <Check size={16} strokeWidth={2.5} aria-hidden />}
                </span>
                <span className={checked[i] ? styles.struck : ''}>{step}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
