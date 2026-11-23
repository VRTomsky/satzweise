// Alle Änderungen an deinen Daten laufen über diese eine Funktion.
// Sie bekommt den alten Zustand und eine Aktion und gibt den neuen Zustand zurück.
// Das macht Änderungen nachvollziehbar und leicht testbar.

import { createDefaultData } from '../data/defaults';
import type {
  AppData,
  DayLog,
  IsoDate,
  Measurement,
  Milestone,
  SetLog,
  Settings,
  TimerState,
} from '../data/types';
import { evaluateMilestones } from '../domain/milestones';
import { plannedWorkout } from '../domain/schedule';

export type Action =
  | { type: 'set/toggle'; date: IsoDate; exerciseId: string; index: number; value?: number }
  | { type: 'set/value'; date: IsoDate; exerciseId: string; index: number; value: number }
  | { type: 'set/weight'; date: IsoDate; exerciseId: string; index: number; weightKg?: number }
  | { type: 'warmup/toggle'; date: IsoDate; index: number }
  | { type: 'day/choose'; date: IsoDate; workoutId: string }
  | { type: 'day/complete'; date: IsoDate; at: string }
  | { type: 'day/reopen'; date: IsoDate }
  | { type: 'day/pause'; date: IsoDate; paused: boolean }
  | { type: 'timer/start'; timer: TimerState }
  | { type: 'timer/extend'; seconds: number }
  | { type: 'timer/stop' }
  | { type: 'measurement/save'; measurement: Measurement }
  | { type: 'measurement/delete'; id: string }
  | { type: 'criterion/toggle'; milestoneId: string; criterionId: string; today: IsoDate }
  | { type: 'milestones/set'; milestones: Milestone[] }
  | { type: 'settings/update'; patch: Partial<Settings> }
  | { type: 'data/replace'; data: AppData }
  | { type: 'data/reset'; today: IsoDate };

function ensureLog(data: AppData, date: IsoDate): DayLog {
  return (
    data.logs[date] ?? {
      workoutId: plannedWorkout(data.settings, date).id,
      warmup: [],
      sets: {},
    }
  );
}

function withLog(data: AppData, date: IsoDate, change: (log: DayLog) => DayLog): AppData {
  return { ...data, logs: { ...data.logs, [date]: change(ensureLog(data, date)) } };
}

function withSet(
  data: AppData,
  date: IsoDate,
  exerciseId: string,
  index: number,
  change: (set: SetLog) => SetLog,
): AppData {
  return withLog(data, date, (log) => {
    const sets = [...(log.sets[exerciseId] ?? [])];
    for (let i = sets.length; i <= index; i++) sets[i] = { done: false };
    sets[index] = change(sets[index]);
    return { ...log, sets: { ...log.sets, [exerciseId]: sets } };
  });
}

/** Nach Änderungen an Messwerten oder Trainings die Etappen neu prüfen. */
function withMilestones(data: AppData): AppData {
  return { ...data, milestones: evaluateMilestones(data.milestones, data) };
}

export function reducer(data: AppData, action: Action): AppData {
  switch (action.type) {
    case 'set/toggle':
      return withSet(data, action.date, action.exerciseId, action.index, (set) =>
        set.done
          ? { ...set, done: false }
          : { ...set, done: true, value: action.value ?? set.value },
      );

    case 'set/value':
      return withSet(data, action.date, action.exerciseId, action.index, (set) => ({
        ...set,
        value: action.value,
      }));

    case 'set/weight':
      return withSet(data, action.date, action.exerciseId, action.index, (set) => ({
        ...set,
        weightKg: action.weightKg,
      }));

    case 'warmup/toggle':
      return withLog(data, action.date, (log) => {
        const warmup = [...log.warmup];
        warmup[action.index] = !warmup[action.index];
        return { ...log, warmup };
      });

    case 'day/choose':
      return withLog(data, action.date, (log) => ({ ...log, workoutId: action.workoutId }));

    case 'day/complete':
      return withMilestones(
        withLog(data, action.date, (log) => ({ ...log, completedAt: action.at, paused: false })),
      );

    case 'day/reopen':
      return withMilestones(
        withLog(data, action.date, (log) => ({ ...log, completedAt: undefined })),
      );

    case 'day/pause':
      return withLog(data, action.date, (log) => ({
        ...log,
        paused: action.paused,
        completedAt: action.paused ? undefined : log.completedAt,
      }));

    case 'timer/start':
      return { ...data, timer: action.timer };

    case 'timer/extend':
      return data.timer
        ? {
            ...data,
            timer: {
              ...data.timer,
              endsAt: data.timer.endsAt + action.seconds * 1000,
              durationSec: data.timer.durationSec + action.seconds,
            },
          }
        : data;

    case 'timer/stop':
      return { ...data, timer: null };

    case 'measurement/save': {
      const others = data.measurements.filter((m) => m.id !== action.measurement.id);
      const measurements = [...others, action.measurement].sort((a, b) =>
        a.date.localeCompare(b.date),
      );
      return withMilestones({ ...data, measurements });
    }

    case 'measurement/delete':
      return withMilestones({
        ...data,
        measurements: data.measurements.filter((m) => m.id !== action.id),
      });

    case 'criterion/toggle': {
      const milestones = data.milestones.map((ms) =>
        ms.id !== action.milestoneId
          ? ms
          : {
              ...ms,
              criteria: ms.criteria.map((c) =>
                c.id === action.criterionId && c.type === 'manual'
                  ? { ...c, doneAt: c.doneAt ? undefined : action.today }
                  : c,
              ),
            },
      );
      return withMilestones({ ...data, milestones });
    }

    case 'milestones/set':
      return withMilestones({ ...data, milestones: action.milestones });

    case 'settings/update':
      return { ...data, settings: { ...data.settings, ...action.patch } };

    case 'data/replace':
      return action.data;

    case 'data/reset':
      return createDefaultData(action.today);
  }
}
