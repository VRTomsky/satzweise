// Vibration: in der App über @capacitor/haptics, im Browser über navigator.vibrate
// (Android-Browser ja, iPhone nein).

import { Haptics } from '@capacitor/haptics';
import { isNativeApp } from './platform';

export function vibrate(pattern: number[]): void {
  if (isNativeApp) {
    const total = pattern.reduce((sum, ms) => sum + ms, 0);
    void Haptics.vibrate({ duration: Math.min(total, 600) });
    return;
  }
  if ('vibrate' in navigator) navigator.vibrate(pattern);
}
