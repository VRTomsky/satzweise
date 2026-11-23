// Welches Training ist an welchem Tag dran?

import { DELOAD_EVERY_WEEKS, DELOAD_SETS, getWorkout, WORKOUTS } from '../data/plan';
import type { AppData, IsoDate, PlannedExercise, Settings, Workout } from '../data/types';
import { programWeek, weekdayOf } from './dates';

const FALLBACK = WORKOUTS[WORKOUTS.length - 1];

/** Training laut Wochenplan. */
export function plannedWorkout(settings: Settings, date: IsoDate): Workout {
  return getWorkout(settings.weekPlan[weekdayOf(date)]) ?? FALLBACK;
}

/** Training, das an dem Tag tatsächlich gilt (auch wenn du getauscht hast). */
export function workoutForDay(data: AppData, date: IsoDate): Workout {
  const chosen = data.logs[date]?.workoutId;
  return (chosen && getWorkout(chosen)) || plannedWorkout(data.settings, date);
}

/** Jede 8. Programmwoche ist eine leichtere Woche. */
export function isDeloadWeek(startDate: IsoDate, date: IsoDate): boolean {
  const week = programWeek(startDate, date);
  return week > 0 && week % DELOAD_EVERY_WEEKS === 0;
}

/** Anzahl Sätze für eine Übung, in der leichten Woche höchstens 2. */
export function setsFor(planned: PlannedExercise, deload: boolean): number {
  return deload ? Math.min(planned.sets, DELOAD_SETS) : planned.sets;
}

export function totalSets(workout: Workout, deload: boolean): number {
  return workout.exercises.reduce((sum, ex) => sum + setsFor(ex, deload), 0);
}

/** Übungen in Blöcke aufteilen: einzelne Übungen und Supersatz-Paare. */
export function groupExercises(exercises: PlannedExercise[]): PlannedExercise[][] {
  const groups: PlannedExercise[][] = [];
  for (const ex of exercises) {
    const last = groups[groups.length - 1];
    if (ex.supersetGroup && last && last[0].supersetGroup === ex.supersetGroup) {
      last.push(ex);
    } else {
      groups.push([ex]);
    }
  }
  return groups;
}
