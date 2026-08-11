import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * base path สำหรับ GitHub Pages
 * - repo ชื่อ `e-card`            → '/e-card/'
 * - repo ชื่อ `<user>.github.io`  → '/'
 * ตั้งผ่าน env `VITE_BASE` ได้ (GitHub Actions ส่งมาให้อัตโนมัติ)
 */
const base = process.env.VITE_BASE ?? '/e-card/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssTarget: 'safari15',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['motion'],
        },
      },
    },
  },
});
