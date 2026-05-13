import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'
import { cvContentPlugin } from '../plugins/cv-content'

async function generate(version: string) {
  const server = await createServer({
    configFile: false,
    plugins: [vue(), cvContentPlugin(version)],
    server: { port: 0 },
    logLevel: 'silent',
  })
  await server.listen()

  const address = server.httpServer?.address()
  const port = typeof address === 'object' && address ? address.port : 5174
  const url = `http://localhost:${port}`

  try {
    const outputDir = path.resolve(
      process.cwd(),
      'content',
      'versions',
      version,
      'generated'
    )
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const contentDir = path.resolve(process.cwd(), 'content')
    const versionDir = path.join(contentDir, 'versions', version)
    const configRaw = fs.readFileSync(path.join(versionDir, 'config.yml'), 'utf-8')
    const config = parseYaml(configRaw)
    const sidebarRaw = fs.readFileSync(path.join(contentDir, 'shared', 'sidebar.yml'), 'utf-8')
    const sidebar = parseYaml(sidebarRaw)
    if (config.sidebar_overrides) Object.assign(sidebar, config.sidebar_overrides)
    const titleRaw = fs.readFileSync(path.resolve(versionDir, config.sections.title), 'utf-8')
    const { data: titleData } = matter(titleRaw)

    const namePart = (sidebar.name as string)
      .split(' ')
      .reverse()
      .join('_')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const jobPart = (titleData.jobTitle as string)
      .split('–')[0]
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const filename = `cv-${namePart}-${jobPart}.pdf`

    const outputPath = path.join(outputDir, filename)

    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle' })

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })

    await browser.close()
    console.log(`PDF generated: ${outputPath}`)
  } finally {
    await server.close()
  }
}

const version = process.argv[2]
if (!version) {
  console.error('Usage: pnpm generate <version>')
  console.error('Example: pnpm generate react-senior-fr')
  process.exit(1)
}

generate(version).catch((err) => {
  console.error('Generation failed:', err)
  process.exit(1)
})
