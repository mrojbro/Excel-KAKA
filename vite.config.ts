import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages project sites live at https://<user>.github.io/<repo>/
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})
