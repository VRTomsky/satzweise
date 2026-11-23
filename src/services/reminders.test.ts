import { describe, expect, it } from 'vitest';
import { isReminderDue, msUntilNext } from './reminders';

describe('Erinnerungen', () => {
  const at = (h: number, m: number) => new Date(2026, 10, 23, h, m);

  it('ist erst nach der eingestellten Uhrzeit fällig', () => {
    const reminder = { enabled: true, time: '18:30' };
    expect(isReminderDue(reminder, at(18, 29))).toBe(false);
    expect(isReminderDue(reminder, at(18, 30))).toBe(true);
    expect(isReminderDue({ ...reminder, enabled: false }, at(20, 0))).toBe(false);
  });

  it('plant die nächste Erinnerung heute oder morgen', () => {
    expect(msUntilNext('18:30', at(18, 0))).toBe(30 * 60_000);
    expect(msUntilNext('18:30', at(19, 0))).toBe(23.5 * 3_600_000);
  });
});
