import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ivanlm99.github.io', // Your GitHub URL
  base: '/astro-astro-gallery', // If your repo name is just 'ivanlm99.github.io' keep this '/'. If it is 'portfolio', change to '/portfolio'
  build: {
    assets: 'assets'
  }
});
