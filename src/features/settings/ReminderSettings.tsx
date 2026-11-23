import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Field } from '../../components/Field';
import fieldStyles from '../../components/Field.module.css';
import { Toggle } from '../../components/Toggle';
import {
  getNotificationPermission,
  requestNotificationPermission,
  type NotificationPermissionState,
} from '../../services/notifications';
import { isNativeApp } from '../../services/platform';
import { useApp } from '../../state/useApp';
import styles from './Settings.module.css';

const PERMISSION_TEXT: Record<NotificationPermissionState, string> = {
  granted: 'Benachrichtigungen sind erlaubt.',
  default: 'Benachrichtigungen sind noch nicht erlaubt.',
  denied:
    'Benachrichtigungen sind blockiert. Du kannst sie in den Einstellungen deines Handys bzw. Browsers wieder erlauben.',
  unsupported:
    'Dieser Browser unterstützt keine Benachrichtigungen. Das Banner funktioniert trotzdem.',
};

export function ReminderSettings() {
  const { data, dispatch } = useApp();
  const { reminder } = data.settings;
  const [permission, setPermission] = useState<NotificationPermissionState>('default');

  useEffect(() => {
    let active = true;
    void getNotificationPermission().then((p) => active && setPermission(p));
    return () => {
      active = false;
    };
  }, []);

  const update = (patch: Partial<typeof reminder>) =>
    dispatch({ type: 'settings/update', patch: { reminder: { ...reminder, ...patch } } });

  return (
    <div className={styles.group}>
      <Toggle
        label="Tägliche Erinnerung"
        description="An Trainingstagen, solange das Training noch offen ist"
        checked={reminder.enabled}
        onChange={(enabled) => update({ enabled })}
      />
      {reminder.enabled && (
        <>
          <Field label="Uhrzeit" htmlFor="reminder-time">
            <input
              id="reminder-time"
              type="time"
              className={fieldStyles.input}
              value={reminder.time}
              onChange={(e) => e.target.value && update({ time: e.target.value })}
            />
          </Field>
          <div className={styles.permission}>
            <p className={styles.hint}>{PERMISSION_TEXT[permission]}</p>
            {permission === 'default' && (
              <Button onClick={async () => setPermission(await requestNotificationPermission())}>
                Benachrichtigungen erlauben
              </Button>
            )}
          </div>
        </>
      )}
      <p className={styles.hint}>
        {isNativeApp
          ? 'Die Erinnerung plant dein Handy selbst. Sie kommt auch, wenn die App geschlossen ist, aber nur an Trainingstagen, die noch offen sind.'
          : 'Ehrlich gesagt: Im Browser kommt die Benachrichtigung nur, wenn die App gerade offen ist oder als installierte App im Hintergrund läuft. Öffnest du sie nach der Erinnerungszeit und hast noch nicht trainiert, siehst du oben auf „Heute“ ein Banner. Zuverlässig auch bei geschlossener App klappt das in der Android-App.'}
      </p>
    </div>
  );
}
