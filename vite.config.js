import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// 팀 표준 프론트(React + Vite + MUI) 골격 설정.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @ -> src
      '@': path.resolve(__dirname, './src'),
    },
  },
})
