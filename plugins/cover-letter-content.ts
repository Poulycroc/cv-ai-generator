import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'
import { marked } from 'marked'

const CONTENT_DIR = path.resolve(process.cwd(), 'content')

function loadSender(sharedDir: string, overrides?: Record<string, unknown>) {
  const raw = fs.readFileSync(path.join(sharedDir, 'sidebar.yml'), 'utf-8')
  const sidebar = parseYaml(raw)
  if (overrides) Object.assign(sidebar, overrides)
  return {
    name: sidebar.name as string,
    address: sidebar.address as string,
    email: sidebar.email as string,
    website: sidebar.website as string,
  }
}

function markdownToPlainText(md: string): string {
  return md
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/^[-*]\s+/gm, '- ')
    .trim()
}

export function coverLetterContentPlugin(version: string): Plugin {
  const sharedDir = path.join(CONTENT_DIR, 'shared')
  const versionDir = path.join(CONTENT_DIR, 'versions', version)

  return {
    name: 'vite-plugin-cover-letter-content',

    resolveId(id) {
      if (id === 'virtual:cover-letter-content') return '\0virtual:cover-letter-content'
    },

    async load(id) {
      if (id !== '\0virtual:cover-letter-content') return

      const configRaw = fs.readFileSync(path.join(versionDir, 'config.yml'), 'utf-8')
      const config = parseYaml(configRaw)

      const sender = loadSender(sharedDir, config.sidebar_overrides)

      const clPath = path.join(versionDir, 'cover-letter.md')
      const clRaw = fs.readFileSync(clPath, 'utf-8')
      const { data, content } = matter(clRaw)

      const bodyHtml = marked.parse(content.trim()) as string
      const bodyText = markdownToPlainText(content.trim())

      const coverLetter = {
        sender,
        recipient: data.recipient as string,
        city: data.city as string,
        date: data.date as string,
        bodyHtml,
        bodyText,
      }

      return `export default ${JSON.stringify(coverLetter)}`
    },

    handleHotUpdate({ file, server }) {
      if (file.startsWith(CONTENT_DIR)) {
        server.ws.send({ type: 'full-reload' })
      }
    },
  }
}
