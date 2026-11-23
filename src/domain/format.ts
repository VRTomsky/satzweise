// Texte für Sätze, Pausen und Bank-Einstellungen.

import type { BenchSetting, Exercise, PlannedExercise, Settings } from '../data/types';

export function formatTarget(planned: PlannedExercise, exercise: Exercise, sets: number): string {
  const perSide = exercise.perSide ? ' pro Seite' : '';
  if (planned.seconds) {
    return `${sets} × ${planned.seconds[0]}–${planned.seconds[1]} s${perSide}`;
  }
  if (planned.repsMax && planned.reps) {
    return `${sets} × so viele wie sauber möglich (Ziel ${planned.reps[0]}–${planned.reps[1]})`;
  }
  if (planned.reps) {
    return `${sets} × ${planned.reps[0]}–${planned.reps[1]}${perSide}`;
  }
  return `${sets} Sätze`;
}

export function formatRest(planned: PlannedExercise): string {
  if (planned.restSec === 0) return 'direkt weiter';
  return planned.supersetGroup
    ? `${planned.restSec} s Pause nach dem Paar`
    : `${planned.restSec} s Pause`;
}

export function formatSeconds(total: number): string {
  const safe = Math.max(0, Math.ceil(total));
  const min = Math.floor(safe / 60);
  const sec = safe % 60;
  return `${min}:${String(sec).padStart(2, '0')}`;
}

/** „Stufe 3 (30°)“, wenn du die Stufe eingetragen hast, sonst nur der Winkel. */
export function formatBench(
  bench: BenchSetting | null,
  levels: Settings['benchLevels'],
  note?: string,
): string | null {
  if (!bench) return null;
  const level = levels[bench];
  const base = level ? `Stufe ${level} (${bench})` : bench;
  return note ? `${base}, ${note}` : base;
}

export function formatNumber(value: number, digits = 1): string {
  return value.toLocaleString('de-DE', { maximumFractionDigits: digits });
}

export function formatSigned(value: number, unit: string, digits = 1): string {
  const rounded = Number(value.toFixed(digits));
  if (rounded === 0) return `±0 ${unit}`;
  const sign = rounded < 0 ? '−' : '+';
  return `${sign}${formatNumber(Math.abs(rounded), digits)} ${unit}`;
}
