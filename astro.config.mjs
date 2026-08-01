import { defineConfig } from 'astro/config';

// Fallback to root '/' if process.env.BASE_PATH isn't set
const BASE_PATH = process.env.BASE_PATH || '/';
const SITE_URL = process.env.SITE_URL || 'https://ilm-astro-gallery.pages.dev';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false 
    }
  },
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      cssCodeSplit: true,
      assetsInlineLimit: 4096
    }
  }
});
