// Läuft die App gerade als Android-App (Capacitor) oder im Browser?

import { Capacitor } from '@capacitor/core';

export const isNativeApp = Capacitor.isNativePlatform();

/** Externe Links: im Browser neuer Tab, in der App öffnet Android selbst den Browser. */
export const externalLinkProps = isNativeApp
  ? {}
  : ({ target: '_blank', rel: 'noopener noreferrer' } as const);
