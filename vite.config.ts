import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { cvContentPlugin } from './plugins/cv-content'

const version = process.env.CV_VERSION || 'react-senior-fr'

export default defineConfig({
  plugins: [vue(), cvContentPlugin(version)],
})
