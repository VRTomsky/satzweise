// Serie: Tage in Folge, an denen der geplante Tag erfüllt wurde.
// Erfüllt = Training abgeschlossen oder Ruhetag. Pausierte Tage (krank, Urlaub)
// zählen nicht mit, unterbrechen die Serie aber auch nicht.

import type { AppData, IsoDate } from '../data/types';
import { addDays } from './dates';
import { plannedWorkout, workoutForDay } from './schedule';

export type DayStatus = 'done' | 'rest' | 'paused' | 'open' | 'missed' | 'future';

export function dayStatus(data: AppData, date: IsoDate, today: IsoDate): DayStatus {
  const log = data.logs[date];
  if (log?.paused) return 'paused';
  if (log?.completedAt) return 'done';

  const isRest =
    plannedWorkout(data.settings, date).kind === 'ruhe' ||
    workoutForDay(data, date).kind === 'ruhe';
  if (isRest) return 'rest';

  if (date > today) return 'future';
  if (date === today) return 'open';
  return 'missed';
}

const isFulfilled = (status: DayStatus) => status === 'done' || status === 'rest';

/**
 * Aktuelle Serie. Ist das heutige Training noch offen, zählt der Stand von gestern.
 * Die Serie reißt erst, wenn ein Tag vorbei ist, ohne erfüllt zu sein.
 */
export function currentStreak(data: AppData, today: IsoDate): number {
  const start = data.settings.startDate;
  let count = 0;

  if (today >= start && isFulfilled(dayStatus(data, today, today))) count++;

  for (let day = addDays(today, -1); day >= start; day = addDays(day, -1)) {
    const status = dayStatus(data, day, today);
    if (isFulfilled(status)) count++;
    else if (status !== 'paused') break;
  }
  return count;
}

/** Längste Serie seit dem Startdatum. */
export function bestStreak(data: AppData, today: IsoDate): number {
  let best = 0;
  let run = 0;

  for (let day = data.settings.startDate; day <= today; day = addDays(day, 1)) {
    const status = dayStatus(data, day, today);
    if (isFulfilled(status)) {
      run++;
      best = Math.max(best, run);
    } else if (status === 'missed') {
      run = 0;
    }
  }
  return best;
}
