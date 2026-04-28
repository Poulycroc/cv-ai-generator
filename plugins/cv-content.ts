import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'
import { marked } from 'marked'
import QRCode from 'qrcode'

const CONTENT_DIR = path.resolve(process.cwd(), 'content')

function loadSidebar(sharedDir: string, overrides?: Record<string, unknown>) {
  const raw = fs.readFileSync(path.join(sharedDir, 'sidebar.yml'), 'utf-8')
  const sidebar = parseYaml(raw)

  // Inline SVG logo
  const logoPath = path.join(sharedDir, sidebar.logo)
  sidebar.logoSvg = fs.readFileSync(logoPath, 'utf-8')

  // Apply overrides (for EN versions etc.)
  if (overrides) {
    Object.assign(sidebar, overrides)
  }

  return sidebar
}

async function generateQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, { type: 'svg', margin: 0 })
}

function parseTitle(raw: string) {
  const { data, content } = matter(raw)
  const summaryHtml = marked.parse(content.trim()) as string
  return { jobTitle: data.jobTitle as string, summaryHtml }
}

function parseExperience(raw: string) {
  const { data, content } = matter(raw)
  const blocks = content.split(/^## /m).filter(Boolean)
  const entries = blocks.map((block) => {
    const lines = block.split('\n')
    const titleLine = lines[0].trim()
    const match = titleLine.match(/^(.+?)\s*\((.+?)\)$/)
    const role = match ? match[1].trim() : titleLine
    const dates = match ? match[2].trim() : ''

    const rest = lines.slice(1).join('\n')
    const companyMatch = rest.match(/^### (.+)/m)
    const company = companyMatch ? companyMatch[1].trim() : ''

    const bullets = rest
      .replace(/^### .+\n?/m, '')
      .split('\n')
      .filter((l) => l.trim().startsWith('- '))
      .map((l) => l.trim().replace(/^- /, ''))

    return { role, dates, company, bullets }
  })
  return { sectionTitle: data.sectionTitle as string, entries }
}

function parseSkills(raw: string) {
  const { data, content } = matter(raw)
  const blocks = content.split(/^## /m).filter(Boolean)
  const categories = blocks.map((block) => {
    const lines = block.split('\n')
    const name = lines[0].trim()
    const items = lines
      .slice(1)
      .filter((l) => l.trim().startsWith('- '))
      .map((l) => l.trim().replace(/^- /, ''))
    return { name, items }
  })
  return { sectionTitle: data.sectionTitle as string, categories }
}

function parseEducation(raw: string) {
  const { data, content } = matter(raw)
  const blocks = content.split(/^## /m).filter(Boolean)
  const entries = blocks.map((block) => {
    const line = block.split('\n')[0].trim()
    const parts = line.split(' - ')
    return {
      school: parts[0] || '',
      program: parts[1] || '',
      dates: parts[2] || '',
    }
  })
  return { sectionTitle: data.sectionTitle as string, entries }
}

export function cvContentPlugin(version: string): Plugin {
  const sharedDir = path.join(CONTENT_DIR, 'shared')
  const versionDir = path.join(CONTENT_DIR, 'versions', version)

  return {
    name: 'vite-plugin-cv-content',

    resolveId(id) {
      if (id === 'virtual:cv-content') return '\0virtual:cv-content'
    },

    async load(id) {
      if (id !== '\0virtual:cv-content') return

      // Read config
      const configRaw = fs.readFileSync(path.join(versionDir, 'config.yml'), 'utf-8')
      const config = parseYaml(configRaw)

      // Load sidebar with optional overrides
      const sidebar = loadSidebar(sharedDir, config.sidebar_overrides)

      // Generate QR code
      sidebar.qrSvg = await generateQrSvg(sidebar.qr_url)

      // Parse each section
      const titleRaw = fs.readFileSync(path.resolve(versionDir, config.sections.title), 'utf-8')
      const title = parseTitle(titleRaw)

      const expRaw = fs.readFileSync(path.resolve(versionDir, config.sections.experience), 'utf-8')
      const experience = parseExperience(expRaw)

      const skillsRaw = fs.readFileSync(path.resolve(versionDir, config.sections.skills), 'utf-8')
      const skills = parseSkills(skillsRaw)

      const eduRaw = fs.readFileSync(path.resolve(versionDir, config.sections.education), 'utf-8')
      const education = parseEducation(eduRaw)

      const cvContent = { sidebar, config: { lang: config.lang, keywords: config.keywords }, title, experience, skills, education }

      return `export default ${JSON.stringify(cvContent)}`
    },

    handleHotUpdate({ file, server }) {
      if (file.startsWith(CONTENT_DIR)) {
        server.ws.send({ type: 'full-reload' })
      }
    },
  }
}
