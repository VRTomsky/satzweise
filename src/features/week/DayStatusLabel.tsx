import { Circle, CircleCheck, CirclePause, Moon } from 'lucide-react';
import { iconSm } from '../../components/icon';
import type { DayStatus } from '../../domain/streak';
import { statusLabel } from './statusLabel';
import styles from './Week.module.css';

/** Status mit Icon und Text, damit er nicht nur über die Farbe erkennbar ist. */
export function DayStatusLabel({ status }: { status: DayStatus }) {
  const Icon =
    status === 'done'
      ? CircleCheck
      : status === 'rest'
        ? Moon
        : status === 'paused'
          ? CirclePause
          : Circle;
  return (
    <span className={`${styles.status} ${status === 'done' ? styles.statusDone : ''}`}>
      <Icon {...iconSm} />
      {statusLabel(status)}
    </span>
  );
}
