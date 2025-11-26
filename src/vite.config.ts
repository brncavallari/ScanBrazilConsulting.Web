import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/app/components'),
      '@configs': path.resolve(__dirname, './src/app/configs'),
      '@pages': path.resolve(__dirname, './src/app/pages'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
})
