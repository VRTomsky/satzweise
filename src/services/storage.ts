// Speichern auf dem Gerät. Im Browser ist das localStorage.
// In der APK kann hier später z. B. @capacitor/preferences rein, der Rest der App bleibt gleich.

const KEY = 'satzweise:data';

export const storage = {
  load(): unknown {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as unknown) : null;
    } catch {
      return null;
    }
  },

  save(data: unknown): boolean {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // Speicher nicht verfügbar, nichts zu tun
    }
  },
};
