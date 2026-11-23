import { CalendarCheck } from 'lucide-react';
import { iconSm } from '../../components/icon';
import { bestStreak, currentStreak } from '../../domain/streak';
import { useApp } from '../../state/useApp';
import styles from './Today.module.css';

const days = (n: number) => `${n} ${n === 1 ? 'Tag' : 'Tagen'}`;

/** Nüchterne Anzeige der Serie: aktuell und beste. */
export function StreakLine() {
  const { data, today } = useApp();
  const current = currentStreak(data, today);
  const best = bestStreak(data, today);

  return (
    <p className={`${styles.streak} num`}>
      <CalendarCheck {...iconSm} className={styles.streakIcon} />
      <span>
        Serie: <strong>{days(current)}</strong>
        {best > 0 && <span className={styles.streakBest}> · Beste: {days(best)}</span>}
      </span>
    </p>
  );
}
