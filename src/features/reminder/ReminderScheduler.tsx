import { useEffect, useRef } from 'react';
import { todayIso } from '../../domain/dates';
import { workoutForDay } from '../../domain/schedule';
import { showNotification } from '../../services/notifications';
import { scheduleDailyReminder } from '../../services/reminders';
import { useApp } from '../../state/useApp';

/** Unsichtbar: schickt zur Erinnerungszeit eine Benachrichtigung, solange die App läuft. */
export function ReminderScheduler() {
  const { data } = useApp();
  const latest = useRef(data);
  const { enabled, time } = data.settings.reminder;

  useEffect(() => {
    latest.current = data;
  }, [data]);

  useEffect(() => {
    if (!enabled) return;
    return scheduleDailyReminder(time, () => {
      const current = latest.current;
      const today = todayIso();
      const workout = workoutForDay(current, today);
      const log = current.logs[today];
      if (workout.kind === 'ruhe' || log?.completedAt || log?.paused) return;
      void showNotification(`Heute: ${workout.name}`, 'Noch offen. Leg los, wenn du so weit bist.');
    });
  }, [enabled, time]);

  return null;
}
