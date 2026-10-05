import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Landing (index.html, na raiz) + web app (app/index.html) no mesmo projeto.
// base './' deixa o build funcionar em qualquer subpasta (ex.: GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app/index.html'),
      },
    },
  },
})
