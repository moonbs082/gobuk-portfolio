import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  /** GitHub Pages(https://moonbs082.github.io/gobuk-portfolio/) 배포 시에만 하위 경로 사용 */
  base: command === 'build' ? '/gobuk-portfolio/' : '/',
}))
