import { describe, expect, it } from 'vitest';
import {
  addDays,
  dateRange,
  diffDays,
  formatLong,
  isIsoDate,
  programWeek,
  startOfWeek,
  todayIso,
  weekDays,
  weekdayOf,
} from './dates';

describe('dates', () => {
  it('liefert das lokale heutige Datum', () => {
    expect(todayIso(new Date(2026, 10, 23, 23, 59))).toBe('2026-11-23');
    expect(todayIso(new Date(2027, 0, 1, 0, 1))).toBe('2027-01-01');
  });

  it('rechnet über Monats- und Jahreswechsel', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29'); // Schaltjahr
    expect(addDays('2027-02-28', 1)).toBe('2027-03-01');
  });

  it('ist unabhängig von der Zeitumstellung', () => {
    expect(addDays('2026-03-28', 1)).toBe('2026-03-29');
    expect(addDays('2026-03-29', 1)).toBe('2026-03-30');
    expect(diffDays('2026-10-24', '2026-10-26')).toBe(2);
  });

  it('kennt Wochentage (Montag = 1, Sonntag = 7)', () => {
    expect(weekdayOf('2026-11-23')).toBe(1);
    expect(weekdayOf('2026-11-29')).toBe(7);
    expect(startOfWeek('2026-11-29')).toBe('2026-11-23');
    expect(startOfWeek('2027-01-01')).toBe('2026-12-28');
  });

  it('liefert alle Tage einer Woche', () => {
    const days = weekDays('2026-12-31');
    expect(days[0]).toBe('2026-12-28');
    expect(days[6]).toBe('2027-01-03');
  });

  it('erzeugt Datumsbereiche', () => {
    expect(dateRange('2026-02-27', '2026-03-02')).toEqual([
      '2026-02-27',
      '2026-02-28',
      '2026-03-01',
      '2026-03-02',
    ]);
  });

  it('zählt Programmwochen ab der Startwoche', () => {
    expect(programWeek('2026-11-25', '2026-11-23')).toBe(1);
    expect(programWeek('2026-11-25', '2026-11-30')).toBe(2);
    expect(programWeek('2026-11-25', '2027-01-18')).toBe(9);
    expect(programWeek('2026-11-25', '2026-11-16')).toBe(0);
  });

  it('prüft ISO-Daten', () => {
    expect(isIsoDate('2026-02-29')).toBe(false);
    expect(isIsoDate('2028-02-29')).toBe(true);
    expect(isIsoDate('23.11.2026')).toBe(false);
  });

  it('formatiert auf Deutsch', () => {
    expect(formatLong('2026-11-23')).toBe('Montag, 23. November');
  });
});
