import { defineConfig } from 'tsup';

import pkg from './package.json';
import { legacyConfig, modernConfig } from './scripts/tsup.cjs';

const external = Object.keys(pkg.peerDependencies || {});

export default defineConfig([
  modernConfig({
    clean: false,
    cssModules: true, // Optional: Enables CSS Modules
    entry: ['src/index.{ts,tsx}', '!**/*.{test,spec,stories}.{ts,tsx}'],
    external,
    loader: {
      '.scss': 'css', // This tells tsup to treat .scss files as CSS
    },
    postcss: true, // This enables PostCSS processing
  }),
  legacyConfig({
    clean: false,
    cssModules: true, // Optional: Enables CSS Modules
    entry: ['src/index.{ts,tsx}', '!**/*.{test,spec,stories}.{ts,tsx}'],
    external,
    loader: {
      '.scss': 'css', // This tells tsup to treat .scss files as CSS
    },
    postcss: true, // This enables PostCSS processing
  }),
]);
