// An welchen der nächsten Tage soll erinnert werden?
// Nur Trainingstage, die noch nicht erledigt oder pausiert sind. Ruhetage nie.

import type { AppData, IsoDate } from '../data/types';
import { addDays } from './dates';
import { workoutForDay } from './schedule';

export interface ReminderDay {
  date: IsoDate;
  workoutName: string;
}

export function reminderDays(data: AppData, today: IsoDate, count = 7): ReminderDay[] {
  const days: ReminderDay[] = [];
  for (let i = 0; i < count; i++) {
    const date = addDays(today, i);
    const workout = workoutForDay(data, date);
    const log = data.logs[date];
    if (workout.kind === 'ruhe' || log?.completedAt || log?.paused) continue;
    days.push({ date, workoutName: workout.name });
  }
  return days;
}
