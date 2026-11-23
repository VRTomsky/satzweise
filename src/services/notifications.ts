// Benachrichtigungen.
// App: @capacitor/local-notifications (Android plant sie selbst, auch bei geschlossener App).
// Browser: Notification API, nur solange die Seite läuft.

import { LocalNotifications } from '@capacitor/local-notifications';
import { isNativeApp } from './platform';

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

function fromNative(display: string): NotificationPermissionState {
  if (display === 'granted') return 'granted';
  if (display === 'denied') return 'denied';
  return 'default';
}

export async function getNotificationPermission(): Promise<NotificationPermissionState> {
  if (isNativeApp) {
    try {
      return fromNative((await LocalNotifications.checkPermissions()).display);
    } catch {
      return 'unsupported';
    }
  }
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (isNativeApp) {
    try {
      return fromNative((await LocalNotifications.requestPermissions()).display);
    } catch {
      return 'unsupported';
    }
  }
  if (!('Notification' in window)) return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

/** Zeigt sofort eine Benachrichtigung (Browser). Auf Android geht das nur über den Service Worker. */
export async function showBrowserNotification(title: string, body: string): Promise<void> {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const options: NotificationOptions = {
    body,
    icon: `${import.meta.env.BASE_URL}pwa-192x192.png`,
    tag: 'satzweise-erinnerung',
  };
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) {
      await registration.showNotification(title, options);
      return;
    }
    new Notification(title, options);
  } catch {
    // Benachrichtigung nicht möglich, das Banner in der App bleibt als Erinnerung.
  }
}
