/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

// Pfad, unter dem die App auf GitHub Pages liegt: https://vrtomsky.github.io/satzweise/
// Für die spätere APK (Capacitor) baust du mit BASE=./ npm run build.
const base = process.env.BASE ?? '/satzweise/';

export default defineConfig({
  base,
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
