// Messwerte glätten: Der 7-Tage-Durchschnitt zählt, nicht der einzelne Tag.

import type { IsoDate, Measurement } from '../data/types';
import { addDays } from './dates';

export interface Point {
  date: IsoDate;
  value: number;
}

export type MetricKey = 'weightKg' | 'waistCm';

/** Alle Werte einer Messgröße, nach Datum sortiert. */
export function seriesOf(measurements: Measurement[], key: MetricKey): Point[] {
  return measurements
    .filter((m) => typeof m[key] === 'number')
    .map((m) => ({ date: m.date, value: m[key] as number }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Durchschnitt aller Werte in den 7 Tagen bis einschließlich `date`. */
export function trailingAverage(points: Point[], date: IsoDate, windowDays = 7): number | null {
  const from = addDays(date, -(windowDays - 1));
  const inWindow = points.filter((p) => p.date >= from && p.date <= date);
  if (inWindow.length === 0) return null;
  return inWindow.reduce((sum, p) => sum + p.value, 0) / inWindow.length;
}

/** Für jedes Messdatum den 7-Tage-Durchschnitt. Das ist die Hauptlinie im Diagramm. */
export function averageSeries(points: Point[]): Point[] {
  const dates = [...new Set(points.map((p) => p.date))];
  return dates.map((date) => ({ date, value: trailingAverage(points, date) ?? 0 }));
}

export interface ChangeSummary {
  current: number | null;
  sinceStart: number | null;
  last4Weeks: number | null;
}

/** Veränderung seit dem ersten Wert und in den letzten 4 Wochen (auf Basis des Durchschnitts). */
export function summarize(points: Point[]): ChangeSummary {
  const avg = averageSeries(points);
  if (avg.length === 0) return { current: null, sinceStart: null, last4Weeks: null };

  const latest = avg[avg.length - 1];
  const first = points[0];
  const cutoff = addDays(latest.date, -28);
  const reference = [...avg].reverse().find((p) => p.date <= cutoff);

  return {
    current: latest.value,
    sinceStart: points.length > 1 ? latest.value - first.value : null,
    last4Weeks: reference ? latest.value - reference.value : null,
  };
}
