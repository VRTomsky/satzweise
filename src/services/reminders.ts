// Tägliche Erinnerung zur eingestellten Uhrzeit.
//
// Browser: Eine Webseite kann nur etwas tun, solange sie offen ist (oder als installierte
// App im Hintergrund läuft). Ist sie ganz geschlossen, kommt keine Erinnerung. Deshalb
// zeigt die App zusätzlich ein Banner, wenn du sie nach der Erinnerungszeit öffnest.
//
// Android-App: Das Handy plant die Erinnerungen selbst (@capacitor/local-notifications).
// Sie kommen auch, wenn die App geschlossen ist.

import { LocalNotifications } from '@capacitor/local-notifications';
import type { IsoDate, ReminderSettings } from '../data/types';
import type { ReminderDay } from '../domain/reminderDays';

/** Minuten seit Mitternacht für "HH:MM". */
export function minutesOf(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** Ist die Erinnerungszeit heute schon vorbei? */
export function isReminderDue(reminder: ReminderSettings, now: Date): boolean {
  if (!reminder.enabled) return false;
  return now.getHours() * 60 + now.getMinutes() >= minutesOf(reminder.time);
}

/** Millisekunden bis zur nächsten Erinnerung (heute oder morgen). */
export function msUntilNext(time: string, now: Date): number {
  const target = new Date(now);
  target.setHours(0, minutesOf(time), 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
  return target.getTime() - now.getTime();
}

/** Browser: plant die Erinnerung jeden Tag neu. Gibt eine Funktion zum Abbrechen zurück. */
export function scheduleDailyReminder(time: string, onFire: () => void): () => void {
  let id: number | undefined;
  const plan = () => {
    id = window.setTimeout(
      () => {
        onFire();
        plan();
      },
      msUntilNext(time, new Date()),
    );
  };
  plan();
  return () => window.clearTimeout(id);
}

/** Eindeutige Nummer pro Tag, z. B. 20261124. */
const idFor = (date: IsoDate) => Number(date.replaceAll('-', ''));

function dateAt(date: IsoDate, time: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  const minutes = minutesOf(time);
  return new Date(y, m - 1, d, Math.floor(minutes / 60), minutes % 60);
}

/** App: alte Erinnerungen löschen und die nächsten Tage neu planen. */
export async function scheduleNativeReminders(time: string, days: ReminderDay[]): Promise<void> {
  await cancelNativeReminders();
  const now = Date.now();
  const notifications = days
    .map((day) => ({ day, at: dateAt(day.date, time) }))
    .filter(({ at }) => at.getTime() > now)
    .map(({ day, at }) => ({
      id: idFor(day.date),
      title: `Heute: ${day.workoutName}`,
      body: 'Noch offen. Leg los, wenn du so weit bist.',
      schedule: { at, allowWhileIdle: true },
    }));
  if (notifications.length > 0) await LocalNotifications.schedule({ notifications });
}

export async function cancelNativeReminders(): Promise<void> {
  const { notifications } = await LocalNotifications.getPending();
  if (notifications.length > 0) {
    await LocalNotifications.cancel({ notifications: notifications.map((n) => ({ id: n.id })) });
  }
}
