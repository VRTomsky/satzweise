import type { TimerState } from '../../data/types';

/** Neuer Pausentimer, der ab jetzt `seconds` Sekunden läuft. */
export function createRestTimer(seconds: number, label: string): TimerState {
  return { endsAt: Date.now() + seconds * 1000, durationSec: seconds, label };
}
