import { describe, expect, it } from 'vitest';
import { bestStreak, currentStreak, dayStatus } from './streak';
import { complete, makeData, pause } from './testUtils';

// 23.11.2026 ist ein Montag. Standardplan: Sonntag ist Ruhetag.

describe('Serie', () => {
  it('beginnt bei 0', () => {
    const data = makeData('2026-11-23');
    expect(currentStreak(data, '2026-11-23')).toBe(0);
    expect(bestStreak(data, '2026-11-23')).toBe(0);
  });

  it('zählt abgeschlossene Tage und den Ruhetag', () => {
    const data = complete(
      makeData('2026-11-23'),
      '2026-11-23',
      '2026-11-24',
      '2026-11-25',
      '2026-11-26',
      '2026-11-27',
      '2026-11-28',
    );
    // Sonntag 29.11. ist Ruhetag und zählt automatisch mit.
    expect(currentStreak(data, '2026-11-29')).toBe(7);
  });

  it('zeigt den Stand von gestern, solange heute noch offen ist', () => {
    const data = complete(makeData('2026-11-23'), '2026-11-23', '2026-11-24');
    expect(dayStatus(data, '2026-11-25', '2026-11-25')).toBe('open');
    expect(currentStreak(data, '2026-11-25')).toBe(2);
    complete(data, '2026-11-25');
    expect(currentStreak(data, '2026-11-25')).toBe(3);
  });

  it('reißt erst, wenn ein Tag vorbei ist', () => {
    const data = complete(makeData('2026-11-23'), '2026-11-23', '2026-11-24');
    // 25.11. wurde nicht erledigt, jetzt ist der 26.11.
    expect(currentStreak(data, '2026-11-26')).toBe(0);
    expect(bestStreak(data, '2026-11-26')).toBe(2);
  });

  it('Ruhetage unterbrechen die Serie nie, auch ohne Eintrag', () => {
    const data = complete(makeData('2026-11-27'), '2026-11-27', '2026-11-28', '2026-11-30');
    expect(dayStatus(data, '2026-11-29', '2026-11-30')).toBe('rest');
    expect(currentStreak(data, '2026-11-30')).toBe(4);
  });

  it('pausierte Tage zählen nicht, unterbrechen aber auch nicht', () => {
    const data = complete(makeData('2026-11-23'), '2026-11-23', '2026-11-25');
    pause(data, '2026-11-24');
    expect(currentStreak(data, '2026-11-25')).toBe(2);
  });

  it('funktioniert über einen Monatswechsel', () => {
    // 26.01.2026 ist ein Montag
    const data = complete(
      makeData('2026-01-26'),
      '2026-01-26',
      '2026-01-27',
      '2026-01-28',
      '2026-01-29',
      '2026-01-30',
      '2026-01-31',
      '2026-02-02',
      '2026-02-03',
    );
    // 01.02. ist Sonntag (Ruhetag)
    expect(currentStreak(data, '2026-02-03')).toBe(9);
  });

  it('funktioniert über einen Jahreswechsel', () => {
    // 28.12.2026 ist ein Montag
    const data = complete(
      makeData('2026-12-28'),
      '2026-12-28',
      '2026-12-29',
      '2026-12-30',
      '2026-12-31',
      '2027-01-01',
      '2027-01-02',
      '2027-01-04',
    );
    expect(currentStreak(data, '2027-01-04')).toBe(8);
    expect(currentStreak(data, '2027-01-05')).toBe(8);
    expect(currentStreak(data, '2027-01-06')).toBe(0);
    expect(bestStreak(data, '2027-01-06')).toBe(8);
  });

  it('merkt sich die beste Serie', () => {
    const data = complete(
      makeData('2026-11-23'),
      '2026-11-23',
      '2026-11-24',
      '2026-11-25',
      '2026-11-27',
    );
    expect(bestStreak(data, '2026-11-27')).toBe(3);
    expect(currentStreak(data, '2026-11-27')).toBe(1);
  });

  it('zählt keine Tage vor dem Startdatum', () => {
    const data = complete(makeData('2026-11-25'), '2026-11-25');
    expect(currentStreak(data, '2026-11-25')).toBe(1);
  });
});
