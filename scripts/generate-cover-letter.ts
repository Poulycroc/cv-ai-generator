import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'
import { coverLetterContentPlugin } from '../plugins/cover-letter-content'

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

async function generate(version: string) {
  const contentDir = path.resolve(process.cwd(), 'content')
  const versionDir = path.join(contentDir, 'versions', version)

  const clPath = path.join(versionDir, 'cover-letter.md')
  if (!fs.existsSync(clPath)) {
    console.error(`No cover-letter.md found in content/versions/${version}/`)
    console.error('Create a cover-letter.md file first.')
    process.exit(1)
  }

  const server = await createServer({
    configFile: false,
    plugins: [vue(), coverLetterContentPlugin(version)],
    root: process.cwd(),
    server: { port: 0 },
    logLevel: 'silent',
  })
  await server.listen()

  const address = server.httpServer?.address()
  const port = typeof address === 'object' && address ? address.port : 5175
  const url = `http://localhost:${port}/cover-letter.html`

  try {
    const outputDir = path.join(versionDir, 'generated')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Build filename from sidebar name
    const configRaw = fs.readFileSync(path.join(versionDir, 'config.yml'), 'utf-8')
    const config = parseYaml(configRaw)
    const sidebarRaw = fs.readFileSync(path.join(contentDir, 'shared', 'sidebar.yml'), 'utf-8')
    const sidebar = parseYaml(sidebarRaw)
    if (config.sidebar_overrides) Object.assign(sidebar, config.sidebar_overrides)

    const namePart = (sidebar.name as string)
      .split(' ')
      .reverse()
      .join('_')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    // Generate PDF
    const pdfPath = path.join(outputDir, `cover-letter-${namePart}.pdf`)
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle' })

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })

    await browser.close()
    console.log(`PDF generated: ${pdfPath}`)

    // Generate TXT
    const clRaw = fs.readFileSync(clPath, 'utf-8')
    const { content } = matter(clRaw)
    const txtContent = markdownToPlainText(content.trim())
    const txtPath = path.join(outputDir, `cover-letter-${namePart}.txt`)
    fs.writeFileSync(txtPath, txtContent, 'utf-8')
    console.log(`TXT generated: ${txtPath}`)
  } finally {
    await server.close()
  }
}

const version = process.argv[2]
if (!version) {
  console.error('Usage: pnpm generate:cover-letter <version>')
  console.error('Example: pnpm generate:cover-letter fullstack-laravel-ai-en')
  process.exit(1)
}

generate(version).catch((err) => {
  console.error('Generation failed:', err)
  process.exit(1)
})
