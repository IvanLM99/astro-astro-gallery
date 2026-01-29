import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ivanlm99.github.io',
  base: '/astro-astro-gallery/', // Change if your repo is named differently
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false // Makes /gallery default to Spanish, /en/gallery for English
    }
  },
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      cssCodeSplit: true, // Better performance
      assetsInlineLimit: 4096 // Inline small assets
    }
  }
});
