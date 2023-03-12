/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
// import { VitePWA } from 'vite-plugin-pwa';
// import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/web',

  server: {
    port: 4200,
    // host: 'localhost',
    // https: true,
    host: true,
  },

  preview: {
    port: 4300,
    host: 'localhost',
    // https: t/ue,
  },

  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   devOptions: {
    //     enabled: false,
    //   },
    //   includeAssets: ['favicon.ico'],
    //   manifest: {
    //     name: 'What do your cheems',
    //     short_name: 'wdyc',
    //     description: 'What do your cheems',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: 'icon-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //       },
    //       {
    //         src: 'icon-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    // }),
    // mkcert({
    //   force: true,
    //   savePath: './',
    // }),
    viteTsConfigPaths({
      root: '../../',
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
