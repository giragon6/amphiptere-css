import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/liquid-navbar/liquid-navbar.ts'),
      name: 'LiquidNavbar',
      fileName: 'liquid-navbar',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
    },
    emptyOutDir: true,
  },
});