import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // v4용 플러그인 임포트

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // v4용 플러그인 사용
  ],
})