// Tägliche Erinnerung zur eingestellten Uhrzeit.
//
// Ehrlich gesagt: Im Browser kann eine Webseite nur dann etwas tun, wenn sie offen ist
// (oder als installierte App noch im Hintergrund läuft). Ist sie ganz geschlossen,
// kommt keine Erinnerung. Deshalb zeigt die App zusätzlich ein Banner, wenn du sie nach
// der Erinnerungszeit öffnest. In der APK ersetzt @capacitor/local-notifications diese
// Datei: Dort plant das Handy die Erinnerung selbst, auch wenn die App zu ist.

import type { ReminderSettings } from '../data/types';

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

/** Plant die Erinnerung jeden Tag neu. Gibt eine Funktion zum Abbrechen zurück. */
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
