// Pausentimer als kompakte Leiste über der Tab-Leiste.
// Er speichert nur die Endzeit. Die verbleibende Zeit wird immer neu aus der Uhrzeit berechnet,
// deshalb stimmt sie auch, wenn der Tab im Hintergrund war oder die Seite neu geladen wurde.

import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { icon } from '../../components/icon';
import { formatSeconds } from '../../domain/format';
import { playChime } from '../../services/sound';
import { vibrate } from '../../services/vibration';
import { useApp } from '../../state/useApp';
import styles from './TimerBar.module.css';

/** Hat die Pause länger als das zurück geendet, gibt es keinen Ton mehr. */
const ALERT_WINDOW_MS = 15_000;
const DONE_VISIBLE_MS = 4_000;

export function TimerBar() {
  const { data, dispatch } = useApp();
  const timer = data.timer;
  const [now, setNow] = useState(() => Date.now());
  const alerted = useRef<number | null>(null);

  useEffect(() => {
    if (!timer) return;
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, 250);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [timer]);

  const remainingMs = timer ? timer.endsAt - now : 0;
  const finished = timer !== null && remainingMs <= 0;

  // Am Ende einmal vibrieren und einen Ton spielen, danach die Leiste ausblenden.
  useEffect(() => {
    if (!timer || !finished) return;
    if (alerted.current !== timer.endsAt) {
      alerted.current = timer.endsAt;
      if (-remainingMs < ALERT_WINDOW_MS) {
        vibrate([200, 100, 200]);
        playChime();
      }
    }
    const hideIn = Math.max(0, DONE_VISIBLE_MS + remainingMs);
    const id = window.setTimeout(() => dispatch({ type: 'timer/stop' }), hideIn);
    return () => window.clearTimeout(id);
  }, [timer, finished, remainingMs, dispatch]);

  if (!timer) return null;

  return (
    <div className={styles.bar} role="timer" aria-live="off">
      <div className={styles.inner}>
        {finished ? (
          <p className={styles.done} role="status">
            <Check {...icon} />
            Pause vorbei. Weiter geht’s.
          </p>
        ) : (
          <>
            <div className={styles.info}>
              <span className={styles.label}>Pause · {timer.label}</span>
              <span className={`${styles.time} num`} aria-label="Verbleibende Pause">
                {formatSeconds(remainingMs / 1000)}
              </span>
            </div>
            <div className={styles.actions}>
              <Button onClick={() => dispatch({ type: 'timer/extend', seconds: 15 })}>+15 s</Button>
              <Button variant="ghost" onClick={() => dispatch({ type: 'timer/stop' })}>
                Überspringen
              </Button>
            </div>
          </>
        )}
      </div>
      <div
        className={styles.progress}
        style={{
          transform: `scaleX(${finished ? 0 : remainingMs / (timer.durationSec * 1000)})`,
        }}
        aria-hidden
      />
    </div>
  );
}
