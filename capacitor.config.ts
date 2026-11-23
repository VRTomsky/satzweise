import type { CapacitorConfig } from '@capacitor/cli';

// Einstellungen für die Android-App. Die Webdateien kommen aus dist/ (npm run build:app).
const config: CapacitorConfig = {
  appId: 'de.satzweise.app',
  appName: 'Satzweise',
  webDir: 'dist',
  android: {
    // Ohne Tracking, ohne Debugging im Release.
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    // Edge-to-Edge ab Android 15: Capacitor liefert die sicheren Ränder als CSS-Variablen.
    SystemBars: {
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_satzweise',
      iconColor: '#2f6b4f',
    },
  },
};

export default config;
