import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Erzeugt die App-Icons aus public/icon.svg: npm run generate-pwa-assets
const accent = '#2f6b4f';

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: accent } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: accent } },
  },
  images: ['public/icon.svg'],
});
