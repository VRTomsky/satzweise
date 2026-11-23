// Bildschirm anlassen während des Trainings (Screen Wake Lock API).
// In der APK später z. B. über @capacitor-community/keep-awake.

import { useEffect } from 'react';

export function isWakeLockSupported(): boolean {
  return 'wakeLock' in navigator;
}

/** Hält den Bildschirm an, solange `active` true ist. */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || !isWakeLockSupported()) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const request = async () => {
      try {
        const lock = await navigator.wakeLock.request('screen');
        if (cancelled) void lock.release();
        else sentinel = lock;
      } catch {
        // z. B. Akku-Sparmodus: dann eben ohne
      }
    };

    // Der Browser gibt die Sperre frei, wenn der Tab im Hintergrund war. Danach neu anfordern.
    const onVisible = () => {
      if (document.visibilityState === 'visible' && (!sentinel || sentinel.released)) {
        void request();
      }
    };

    void request();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      void sentinel?.release();
    };
  }, [active]);
}
