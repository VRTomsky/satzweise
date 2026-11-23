// Datumsrechnung mit ISO-Daten ("2026-11-23").
// Wir rechnen intern in UTC, damit Sommer-/Winterzeit nichts verschiebt.

import type { IsoDate, Weekday } from '../data/types';

const pad = (n: number) => String(n).padStart(2, '0');

/** Heutiges Datum in deiner lokalen Zeitzone. */
export function todayIso(now: Date = new Date()): IsoDate {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function toUtc(iso: IsoDate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUtc(date: Date): IsoDate {
  return date.toISOString().slice(0, 10);
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return fromUtc(toUtc(value)) === value;
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  const date = toUtc(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return fromUtc(date);
}

/** Anzahl Tage von a bis b (b − a). */
export function diffDays(a: IsoDate, b: IsoDate): number {
  return Math.round((toUtc(b).getTime() - toUtc(a).getTime()) / 86_400_000);
}

/** 1 = Montag … 7 = Sonntag. */
export function weekdayOf(iso: IsoDate): Weekday {
  const day = toUtc(iso).getUTCDay(); // 0 = Sonntag
  return (day === 0 ? 7 : day) as Weekday;
}

/** Montag der Woche, in der das Datum liegt. */
export function startOfWeek(iso: IsoDate): IsoDate {
  return addDays(iso, 1 - weekdayOf(iso));
}

/** Alle 7 Tage (Montag bis Sonntag) der Woche des Datums. */
export function weekDays(iso: IsoDate): IsoDate[] {
  const monday = startOfWeek(iso);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** Liste aller Tage von a bis b (beide eingeschlossen). */
export function dateRange(from: IsoDate, to: IsoDate): IsoDate[] {
  const days: IsoDate[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) days.push(d);
  return days;
}

/**
 * Programmwoche (1, 2, 3 …), gezählt ab der Woche des Startdatums.
 * Liegt das Datum vor dem Start, ist das Ergebnis 0.
 */
export function programWeek(startDate: IsoDate, iso: IsoDate): number {
  const diff = diffDays(startOfWeek(startDate), startOfWeek(iso));
  return diff < 0 ? 0 : diff / 7 + 1;
}

export const WEEKDAY_NAMES: Record<Weekday, string> = {
  1: 'Montag',
  2: 'Dienstag',
  3: 'Mittwoch',
  4: 'Donnerstag',
  5: 'Freitag',
  6: 'Samstag',
  7: 'Sonntag',
};

export const WEEKDAY_SHORT: Record<Weekday, string> = {
  1: 'Mo',
  2: 'Di',
  3: 'Mi',
  4: 'Do',
  5: 'Fr',
  6: 'Sa',
  7: 'So',
};

const MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

/** "23. November" */
export function formatDayMonth(iso: IsoDate): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${d}. ${MONTHS[m - 1]}`;
}

/** "Montag, 23. November" */
export function formatLong(iso: IsoDate): string {
  return `${WEEKDAY_NAMES[weekdayOf(iso)]}, ${formatDayMonth(iso)}`;
}

/** "23.11.2026" */
export function formatShort(iso: IsoDate): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

/** "23.11." */
export function formatDayDot(iso: IsoDate): string {
  const [, m, d] = iso.split('-');
  return `${d}.${m}.`;
}
