import { describe, expect, it } from 'vitest';
import { reminderDays } from './reminderDays';
import { complete, makeData, pause } from './testUtils';

describe('Erinnerungstage', () => {
  it('lässt Ruhetage, erledigte und pausierte Tage weg', () => {
    // 23.11.2026 ist ein Montag, Sonntag (29.11.) ist Ruhetag
    const data = complete(makeData('2026-11-23'), '2026-11-23');
    pause(data, '2026-11-25');
    const days = reminderDays(data, '2026-11-23').map((d) => d.date);
    expect(days).toEqual(['2026-11-24', '2026-11-26', '2026-11-27', '2026-11-28']);
  });

  it('nennt das Training des Tages', () => {
    const [first] = reminderDays(makeData('2026-11-23'), '2026-11-23');
    expect(first).toEqual({ date: '2026-11-23', workoutName: 'Oberkörper A' });
  });
});
