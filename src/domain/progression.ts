// Doppelte Progression: Schaffst du in allen Sätzen die obere Grenze, wird die Übung schwerer.

import type { AppData, IsoDate, PlannedExercise, SetLog } from '../data/types';

export interface Session {
  date: IsoDate;
  sets: SetLog[];
}

/** Letzte Einheit vor `before`, in der du diese Übung gemacht hast. */
export function lastSession(data: AppData, exerciseId: string, before: IsoDate): Session | null {
  const dates = Object.keys(data.logs)
    .filter((d) => d < before)
    .sort()
    .reverse();

  for (const date of dates) {
    const sets = data.logs[date].sets[exerciseId];
    if (sets?.some((s) => s.done)) return { date, sets };
  }
  return null;
}

/** Werte der erledigten Sätze, z. B. [14, 13, 12]. */
export function doneValues(sets: SetLog[]): number[] {
  return sets.filter((s) => s.done && typeof s.value === 'number').map((s) => s.value as number);
}

export function rangeOf(planned: PlannedExercise): [number, number] | null {
  return planned.reps ?? planned.seconds ?? null;
}

/** Alle geforderten Sätze erledigt und jeder an der oberen Grenze? */
export function reachedTop(
  planned: PlannedExercise,
  sets: SetLog[],
  requiredSets: number,
): boolean {
  const range = rangeOf(planned);
  if (!range) return false;
  const done = sets.filter((s) => s.done);
  return done.length >= requiredSets && done.every((s) => (s.value ?? 0) >= range[1]);
}

export type ProgressionHint = 'this-time' | 'next-time' | null;

/**
 * 'next-time': heute schon alle Sätze oben → nächstes Mal schwerer.
 * 'this-time': beim letzten Mal alle Sätze oben → heute schwerer machen.
 */
export function progressionHint(
  planned: PlannedExercise,
  data: AppData,
  today: IsoDate,
  requiredSets: number,
): ProgressionHint {
  const todaySets = data.logs[today]?.sets[planned.exerciseId] ?? [];
  if (reachedTop(planned, todaySets, requiredSets)) return 'next-time';

  const last = lastSession(data, planned.exerciseId, today);
  if (last && reachedTop(planned, last.sets, planned.sets)) return 'this-time';
  return null;
}

/** Vorbelegter Wert für einen Satz: heute eingetragen, sonst letztes Mal, sonst untere Grenze. */
export function prefillValue(
  planned: PlannedExercise,
  todaySets: SetLog[],
  last: Session | null,
  index: number,
): number {
  const own = todaySets[index]?.value;
  if (typeof own === 'number') return own;

  if (last) {
    const values = doneValues(last.sets);
    const fromLast = last.sets[index]?.done ? last.sets[index].value : values[values.length - 1];
    if (typeof fromLast === 'number') return fromLast;
  }
  return rangeOf(planned)?.[0] ?? 10;
}
