// Bildschirm anlassen während des Trainings.
// App: @capacitor-community/keep-awake. Browser: Screen Wake Lock API.

import { KeepAwake } from '@capacitor-community/keep-awake';
import { useEffect } from 'react';
import { isNativeApp } from './platform';

function useBrowserWakeLock(active: boolean): void {
  useEffect(() => {
    if (isNativeApp || !active || !('wakeLock' in navigator)) return;

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

function useNativeKeepAwake(active: boolean): void {
  useEffect(() => {
    if (!isNativeApp || !active) return;
    void KeepAwake.keepAwake().catch(() => undefined);
    return () => {
      void KeepAwake.allowSleep().catch(() => undefined);
    };
  }, [active]);
}

/** Hält den Bildschirm an, solange `active` true ist. */
export function useWakeLock(active: boolean): void {
  useBrowserWakeLock(active);
  useNativeKeepAwake(active);
}
