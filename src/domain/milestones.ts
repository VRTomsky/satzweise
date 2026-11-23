// Etappen: Ziele aus Gewicht, Bauchumfang und Trainingswochen hakt die App selbst ab.
// Das Ergebnis wird immer aus der ganzen Historie berechnet. Steigt das Gewicht später
// wieder, bleibt ein erreichtes Ziel also erreicht. Nur ein gelöschter Messwert nimmt es zurück.

import { getWorkout } from '../data/plan';
import type { AppData, Criterion, IsoDate, Milestone } from '../data/types';
import { averageSeries, seriesOf, type Point } from './average';
import { startOfWeek } from './dates';

/** Ab so vielen Krafttrainings pro Woche zählt eine Woche als „drangeblieben“. */
export const ACTIVE_WEEK_SESSIONS = 3;

function strengthDaysPerWeek(data: AppData): number {
  return Object.values(data.settings.weekPlan).filter((id) => getWorkout(id)?.kind === 'kraft')
    .length;
}

/**
 * Für jede Woche, in der du genug Krafttrainings abgeschlossen hast,
 * das Datum, an dem die Woche voll wurde. Sortiert.
 */
export function activeWeekDates(data: AppData): IsoDate[] {
  const needed = Math.max(1, Math.min(ACTIVE_WEEK_SESSIONS, strengthDaysPerWeek(data)));
  const byWeek = new Map<IsoDate, IsoDate[]>();

  for (const [date, log] of Object.entries(data.logs)) {
    if (!log.completedAt || getWorkout(log.workoutId)?.kind !== 'kraft') continue;
    const week = startOfWeek(date);
    byWeek.set(week, [...(byWeek.get(week) ?? []), date]);
  }

  return [...byWeek.values()]
    .filter((dates) => dates.length >= needed)
    .map((dates) => dates.sort()[needed - 1])
    .sort();
}

interface Context {
  weightAvg: Point[];
  waist: Point[];
  activeWeeks: IsoDate[];
}

function buildContext(data: AppData): Context {
  return {
    weightAvg: averageSeries(seriesOf(data.measurements, 'weightKg')),
    waist: seriesOf(data.measurements, 'waistCm'),
    activeWeeks: activeWeekDates(data),
  };
}

function autoDoneAt(criterion: Criterion, ctx: Context): IsoDate | undefined {
  switch (criterion.type) {
    case 'manual':
      return criterion.doneAt;
    case 'activeWeeks':
      return ctx.activeWeeks[criterion.weeks - 1];
    case 'weightBelow':
      return ctx.weightAvg.find((p) => p.value < criterion.kg)?.date;
    case 'weightRange':
      return ctx.weightAvg.find((p) => p.value >= criterion.minKg && p.value <= criterion.maxKg)
        ?.date;
    case 'waistDelta': {
      const baseline = ctx.waist[0];
      if (!baseline) return undefined;
      return ctx.waist.find(
        (p) => p.date > baseline.date && baseline.value - p.value >= criterion.cm,
      )?.date;
    }
  }
}

export function evaluateMilestones(milestones: Milestone[], data: AppData): Milestone[] {
  const ctx = buildContext(data);

  return milestones.map((ms) => {
    const criteria = ms.criteria.map((c) => ({ ...c, doneAt: autoDoneAt(c, ctx) }));
    const doneDates = criteria.map((c) => c.doneAt);
    const allDone = criteria.length > 0 && doneDates.every(Boolean);
    const achievedAt = allDone ? (doneDates as IsoDate[]).sort()[doneDates.length - 1] : undefined;
    return { ...ms, criteria, achievedAt };
  });
}

/** Die erste noch nicht erreichte Etappe. */
export function nextMilestone(milestones: Milestone[]): Milestone | undefined {
  return milestones.find((ms) => !ms.achievedAt);
}

export function milestoneProgress(ms: Milestone): { done: number; total: number } {
  return { done: ms.criteria.filter((c) => c.doneAt).length, total: ms.criteria.length };
}

const kg = (n: number) => `${n.toLocaleString('de-DE', { maximumFractionDigits: 1 })} kg`;

/** Kurzer Stand für automatische Ziele, z. B. „4 von 12 Wochen“. */
export function criterionDetail(criterion: Criterion, data: AppData): string | null {
  if (criterion.doneAt || criterion.type === 'manual') return null;
  const ctx = buildContext(data);

  switch (criterion.type) {
    case 'activeWeeks':
      return `${ctx.activeWeeks.length} von ${criterion.weeks} Wochen`;
    case 'weightBelow':
    case 'weightRange': {
      const latest = ctx.weightAvg[ctx.weightAvg.length - 1];
      return latest
        ? `Aktuell ${kg(latest.value)} (7-Tage-Schnitt)`
        : 'Noch kein Gewicht eingetragen';
    }
    case 'waistDelta': {
      const first = ctx.waist[0];
      const latest = ctx.waist[ctx.waist.length - 1];
      if (!first) return 'Noch kein Bauchumfang eingetragen';
      const delta = latest.value - first.value;
      return `Bisher ${delta <= 0 ? '−' : '+'}${Math.abs(delta).toLocaleString('de-DE', { maximumFractionDigits: 1 })} cm`;
    }
  }
}
