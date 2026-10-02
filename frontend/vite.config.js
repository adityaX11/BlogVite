import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Raise the chunk size warning threshold (Three.js is intentionally large)
    chunkSizeWarningLimit: 1600,

    rollupOptions: {
      output: {
        // Manual chunking — split Three.js and vendor into separate chunks
        // so browsers can cache them independently
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-three': ['three'],
          'vendor-fiber': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
