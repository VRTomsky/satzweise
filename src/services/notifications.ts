// Benachrichtigungen über die Notification API.
// In der APK später über @capacitor/local-notifications, die auch bei geschlossener App kommen.

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

export function notificationPermission(): NotificationPermissionState {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!('Notification' in window)) return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

/** Zeigt eine Benachrichtigung. Auf Android geht das nur über den Service Worker. */
export async function showNotification(title: string, body: string): Promise<void> {
  if (notificationPermission() !== 'granted') return;
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
