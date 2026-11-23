import { useEffect, useRef } from 'react';
import { todayIso } from '../../domain/dates';
import { reminderDays } from '../../domain/reminderDays';
import { showBrowserNotification } from '../../services/notifications';
import { isNativeApp } from '../../services/platform';
import {
  cancelNativeReminders,
  scheduleDailyReminder,
  scheduleNativeReminders,
} from '../../services/reminders';
import { useApp } from '../../state/useApp';

/** Browser: schickt zur Erinnerungszeit eine Benachrichtigung, solange die Seite läuft. */
function BrowserReminders() {
  const { data } = useApp();
  const latest = useRef(data);
  const { enabled, time } = data.settings.reminder;

  useEffect(() => {
    latest.current = data;
  }, [data]);

  useEffect(() => {
    if (!enabled) return;
    return scheduleDailyReminder(time, () => {
      const [today] = reminderDays(latest.current, todayIso(), 1);
      if (today) {
        void showBrowserNotification(
          `Heute: ${today.workoutName}`,
          'Noch offen. Leg los, wenn du so weit bist.',
        );
      }
    });
  }, [enabled, time]);

  return null;
}

/** App: plant die Erinnerungen der nächsten 7 Tage bei jeder Änderung neu. */
function NativeReminders() {
  const { data, today } = useApp();
  const { enabled, time } = data.settings.reminder;

  useEffect(() => {
    // Kurz warten, damit nicht bei jedem abgehakten Satz neu geplant wird.
    const id = window.setTimeout(() => {
      const task = enabled
        ? scheduleNativeReminders(time, reminderDays(data, today))
        : cancelNativeReminders();
      void task.catch(() => undefined);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [data, today, enabled, time]);

  return null;
}

export function ReminderScheduler() {
  return isNativeApp ? <NativeReminders /> : <BrowserReminders />;
}
