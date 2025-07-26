import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@vendor': path.resolve(__dirname, './Vendor_page'),
      '@employee': path.resolve(__dirname, './employee'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});