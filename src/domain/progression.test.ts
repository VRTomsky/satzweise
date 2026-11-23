import { describe, expect, it } from 'vitest';
import type { PlannedExercise, SetLog } from '../data/types';
import { lastSession, prefillValue, progressionHint, reachedTop } from './progression';
import { makeData } from './testUtils';

const bench: PlannedExercise = {
  label: '1',
  exerciseId: 'kh-bankdruecken',
  sets: 3,
  reps: [10, 15],
  restSec: 90,
  startLoad: '2 × 10 kg',
};

const plank: PlannedExercise = {
  label: '6a',
  exerciseId: 'plank',
  sets: 3,
  seconds: [30, 45],
  restSec: 0,
  startLoad: 'Körpergewicht',
};

const sets = (...values: number[]): SetLog[] => values.map((value) => ({ done: true, value }));

function withSession(date: string, exerciseId: string, logs: SetLog[]) {
  const data = makeData('2026-11-01');
  data.logs[date] = { workoutId: 'oberkoerper-a', warmup: [], sets: { [exerciseId]: logs } };
  return data;
}

describe('Progression', () => {
  it('erkennt, wenn alle Sätze an der oberen Grenze sind', () => {
    expect(reachedTop(bench, sets(15, 15, 15), 3)).toBe(true);
    expect(reachedTop(bench, sets(16, 15, 15), 3)).toBe(true);
    expect(reachedTop(bench, sets(15, 15, 14), 3)).toBe(false);
    expect(reachedTop(bench, sets(15, 15), 3)).toBe(false);
  });

  it('funktioniert auch mit Sekunden', () => {
    expect(reachedTop(plank, sets(45, 45, 45), 3)).toBe(true);
    expect(reachedTop(plank, sets(45, 40, 45), 3)).toBe(false);
  });

  it('zeigt „diesmal schwerer“ nach einer starken letzten Einheit', () => {
    const data = withSession('2026-11-16', 'kh-bankdruecken', sets(15, 15, 15));
    expect(progressionHint(bench, data, '2026-11-23', 3)).toBe('this-time');
  });

  it('zeigt „nächstes Mal schwerer“, wenn heute alles oben ist', () => {
    const data = withSession('2026-11-23', 'kh-bankdruecken', sets(15, 15, 15));
    expect(progressionHint(bench, data, '2026-11-23', 3)).toBe('next-time');
  });

  it('zeigt nichts, wenn die obere Grenze nicht geschafft wurde', () => {
    const data = withSession('2026-11-16', 'kh-bankdruecken', sets(14, 13, 12));
    expect(progressionHint(bench, data, '2026-11-23', 3)).toBeNull();
  });

  it('findet die letzte Einheit vor heute', () => {
    const data = withSession('2026-11-16', 'kh-bankdruecken', sets(14, 13, 12));
    data.logs['2026-11-09'] = {
      workoutId: 'oberkoerper-a',
      warmup: [],
      sets: { 'kh-bankdruecken': sets(10, 10, 10) },
    };
    expect(lastSession(data, 'kh-bankdruecken', '2026-11-23')?.date).toBe('2026-11-16');
    expect(lastSession(data, 'kh-bankdruecken', '2026-11-16')?.date).toBe('2026-11-09');
  });

  it('belegt Wiederholungen mit dem letzten Mal vor', () => {
    const last = { date: '2026-11-16', sets: sets(14, 13, 12) };
    expect(prefillValue(bench, [], last, 0)).toBe(14);
    expect(prefillValue(bench, [], last, 2)).toBe(12);
    expect(prefillValue(bench, [{ done: false, value: 11 }], last, 0)).toBe(11);
    expect(prefillValue(bench, [], null, 0)).toBe(10);
  });
});
