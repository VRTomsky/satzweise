/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json' with { type: 'json' };

// Zwei Varianten:
// - Web (npm run build): liegt auf GitHub Pages unter /satzweise/, mit Service Worker (PWA).
// - App (npm run build:app): relativer Pfad für die Android-App, ohne Service Worker,
//   weil Capacitor die Dateien sowieso direkt aus der APK lädt.
export default defineConfig(({ mode }) => {
  const isApp = mode === 'app';
  const base = isApp ? './' : '/satzweise/';

  return {
    base,
    plugins: [
      react(),
      // Macht die Webseite installierbar und offline nutzbar (Service Worker + Manifest).
      !isApp &&
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon-180x180.png'],
          manifest: {
            name: 'Satzweise',
            short_name: 'Satzweise',
            description: 'Mein Trainingsplan für zu Hause.',
            lang: 'de',
            start_url: base,
            scope: base,
            display: 'standalone',
            orientation: 'portrait',
            background_color: '#fafafa',
            theme_color: '#fafafa',
            icons: [
              { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
              { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
              { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
              {
                src: 'maskable-icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
              },
            ],
          },
          workbox: {
            // Alles vorab speichern, auch die Übungsbilder, damit die App komplett offline läuft.
            globPatterns: ['**/*.{js,css,html,svg,png,ico,webp}'],
            navigateFallback: 'index.html',
          },
        }),
    ],
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  };
});
