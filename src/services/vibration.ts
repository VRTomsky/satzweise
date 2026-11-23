// Vibration. Im Browser über navigator.vibrate (Android ja, iPhone nein).
// In der APK später über @capacitor/haptics.

export function vibrate(pattern: number | number[]): void {
  if ('vibrate' in navigator) navigator.vibrate(pattern);
}
