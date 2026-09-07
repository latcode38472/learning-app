import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// The app is a static single-page app. Python runs in the browser (Pyodide,
// served from /pyodide). No server is required for lessons, exercises or grading.
//
// VITE_BASE sets the public path. Leave it unset for local dev and for hosts
// that serve the site at the domain root; set it to "/<repo>/" when publishing
// to a GitHub Pages project site (the deploy workflow does this).
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  worker: {
    format: 'es',
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Keep lesson content, the editor and React in separate chunks so a
        // content update does not invalidate the cached vendor code.
        manualChunks(id) {
          if (id.includes('/src/content/')) return 'content';
          if (id.includes('node_modules/@codemirror') || id.includes('node_modules/codemirror') || id.includes('node_modules/@uiw') || id.includes('node_modules/@lezer')) return 'editor';
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler') || id.includes('node_modules/zustand')) return 'vendor';
          return undefined;
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
  },
});
