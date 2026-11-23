import { describe, expect, it } from 'vitest';
import { averageSeries, summarize, trailingAverage, type Point } from './average';

const points: Point[] = [
  { date: '2026-11-23', value: 108 },
  { date: '2026-11-26', value: 107 },
  { date: '2026-11-30', value: 107.4 },
  { date: '2026-12-03', value: 106.6 },
];

describe('7-Tage-Durchschnitt', () => {
  it('mittelt alle Werte der letzten 7 Tage', () => {
    expect(trailingAverage(points, '2026-11-26')).toBe(107.5);
    expect(trailingAverage(points, '2026-11-30')).toBeCloseTo(107.2);
    expect(trailingAverage(points, '2026-11-22')).toBeNull();
  });

  it('liefert einen Wert pro Messdatum', () => {
    expect(averageSeries(points).map((p) => p.date)).toEqual(points.map((p) => p.date));
  });

  it('fasst die Veränderung zusammen', () => {
    const summary = summarize(points);
    expect(summary.current).toBeCloseTo(107);
    expect(summary.sinceStart).toBeCloseTo(-1);
    expect(summary.last4Weeks).toBeNull(); // noch keine 4 Wochen Daten
  });

  it('vergleicht mit dem Stand vor 4 Wochen', () => {
    const summary = summarize([...points, { date: '2026-12-28', value: 104 }]);
    // Referenz: Schnitt am 30.11. (107 und 107,4) = 107,2
    expect(summary.last4Weeks).toBeCloseTo(104 - 107.2);
  });
});
