/// <reference types="vite/client" />

declare module 'virtual:cv-content' {
  import type { CvContent } from './types/content'
  const content: CvContent
  export default content
}
