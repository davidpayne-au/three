import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite';
// import fs from "fs"; // Uncomment this line to enable HTTPS with self-signed certificates

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
   // Load environment variables so we can read VITE_BASE when building for GitHub Pages
  const env =   loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE || "./";
  return {
    plugins: [react()],
    base: base,
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
      coverage: {
        reporter: ['text', 'json-summary'],
      },
    }
  };
})

