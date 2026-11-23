// Hilfsfunktionen nur für die Tests.

import { createDefaultData } from '../data/defaults';
import type { AppData, IsoDate } from '../data/types';
import { plannedWorkout } from './schedule';

export function makeData(startDate: IsoDate): AppData {
  return createDefaultData(startDate);
}

/** Markiert die Tage als abgeschlossen (mit dem geplanten Training). */
export function complete(data: AppData, ...dates: IsoDate[]): AppData {
  for (const date of dates) {
    data.logs[date] = {
      workoutId: plannedWorkout(data.settings, date).id,
      warmup: [],
      sets: {},
      completedAt: `${date}T18:00:00.000Z`,
    };
  }
  return data;
}

export function pause(data: AppData, ...dates: IsoDate[]): AppData {
  for (const date of dates) {
    data.logs[date] = {
      workoutId: plannedWorkout(data.settings, date).id,
      warmup: [],
      sets: {},
      paused: true,
    };
  }
  return data;
}
