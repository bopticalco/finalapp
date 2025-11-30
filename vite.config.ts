import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      {
        name: 'copy-pwa-assets',
        closeBundle() {
          // This copies your icon and manifest to the final website folder
          const files = ['icon.png', 'manifest.json', 'service-worker.js'];
          files.forEach(file => {
            try {
              if (fs.existsSync(file)) {
                fs.copyFileSync(file, path.resolve('dist', file));
              }
            } catch (e) {
              console.warn(`Could not copy ${file}`, e);
            }
          });
        }
      }
    ],
    build: {
      outDir: 'dist',
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    }
  };
});
