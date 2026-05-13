/// <reference types="vite/client" />

declare module 'virtual:cv-content' {
  import type { CvContent } from './types/content'
  const content: CvContent
  export default content
}

declare module 'virtual:cover-letter-content' {
  import type { CoverLetterData } from './types/content'
  const content: CoverLetterData
  export default content
}
