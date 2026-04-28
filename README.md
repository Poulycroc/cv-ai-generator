# CV Generator

A markdown-driven CV/resume builder powered by AI. Write your experience once, then generate tailored CVs for each job offer by asking Claude (or any AI assistant).

Built with Vite + Vue 3 + TypeScript. Outputs pixel-perfect A4 PDFs via Playwright.

## How It Works

1. You fill in your **personal info** and **full experience history** once
2. When you find a job offer, paste it and ask Claude to generate a tailored version
3. Claude reads your experience database, picks the most relevant entries, and creates adapted markdown files
4. Preview in browser, generate PDF, send it

## Quick Start

```bash
# Clone and install
git clone https://github.com/Poulycroc/cv-ai-generator.git
cd cvgenerator
pnpm install

# Copy example content as starting point
cp -r content/examples/shared/* content/shared/
cp -r content/examples/versions/* content/versions/

# Preview the example CV
pnpm dev

# Generate PDF
pnpm generate fullstack-example-en
```

## Setup — Make It Yours

The repo ships with example content in `content/examples/`. Your personal content goes in `content/shared/` and `content/versions/` (both gitignored so your data stays private).

### 1. Personal Info — `content/shared/sidebar.yml`

Copy from example and edit:

```bash
cp content/examples/shared/sidebar.yml content/shared/sidebar.yml
```

```yaml
name: Your Name
birthdate: January 1, 1990
address: Your City
phone: "+1 234 567 890"
email: you@example.com
website: yoursite.com
qr_url: https://yoursite.com    # URL encoded in the QR code

languages:
  - name: English
    level: Native
    bar: 100          # visual bar width (0-100)
  - name: French
    level: Professional
    bar: 80

mobility: Driving license B

interests:
  - Coding
  - Music
  - Hiking

photo: profile-pic.jpg    # filename in content/shared/
logo: cv_logo.svg          # filename in content/shared/
```

### 2. Profile Photo

Place your photo in `content/shared/profile-pic.jpg`.

Tips:
- **JPEG format** recommended (much smaller than PNG)
- **~400px wide** is plenty — it displays small on the CV
- Keep it **under 100KB** to avoid heavy PDFs
- Square or portrait orientation works best

### 3. Logo

Place your logo in `content/shared/cv_logo.svg`.

- SVG format (it's inlined directly in the sidebar HTML)
- Displayed at ~14mm wide in the sidebar footer
- Keep it simple — it's small on the page
- If you don't have a logo, you can remove it from the sidebar component

### 4. QR Code

The QR code is **auto-generated** from the `qr_url` field in `sidebar.yml`. No file needed — the Vite plugin generates an SVG at build time using the `qrcode` npm package.

Just set `qr_url` to whatever URL you want people to reach when they scan it (your portfolio, LinkedIn, etc.).

### 5. Experience Database — `content/shared/experience-database.md`

This is the most important file. It contains **ALL** your work experience — even roles you wouldn't put on every CV. This is your source of truth.

```bash
cp content/examples/shared/experience-database.md content/shared/experience-database.md
```

For each role, include:

```markdown
## Company Name — Job Title
- **Type:** Full-time / Freelance / Part-time
- **Period:** Month Year – Month Year
- **Location:** City (remote/hybrid/on-site)
- **Stack:** Tech1, Tech2, Tech3
- **Description:** What the company/project does.
- **Highlights:**
  - What you actually built or achieved
  - Specific impact and results
  - Technologies and methods used
```

The more detail here, the better Claude can tailor your CVs.

### 6. Preferences — `content/shared/preferences.md`

Your personal CV generation rules. Claude reads this before creating any version.

```bash
cp content/examples/shared/preferences.md content/shared/preferences.md
```

Examples of things to configure:
- What to include/exclude in skills (e.g., editors, soft skills)
- How many experience entries to include
- Whether to group similar roles
- Tone and writing style
- Any personal rules (e.g., "always mention open source contributions")

### 7. Create Your First Version

```bash
mkdir -p content/versions/my-first-cv/generated
```

Then either:
- **Ask Claude:** paste a job offer and say *"generate a CV for this offer"*
- **Write manually:** create the markdown files (see `content/examples/versions/` for the format)

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Preview default version in browser |
| `CV_VERSION=<name> pnpm dev` | Preview specific version |
| `pnpm generate <name>` | Generate PDF to `content/versions/<name>/generated/cv.pdf` |

## Using with Claude Code

The `CLAUDE.md` file contains instructions that Claude reads automatically. When you paste a job offer, Claude will:

1. Read your preferences and experience database
2. Read existing CV versions (to learn from past adaptations)
3. Pick the most relevant experience for the offer
4. Generate tailored markdown files
5. You preview, tweak if needed, and generate the PDF

Example prompt:
```
Here's a job offer, generate a CV version for it:

[paste the full job offer text]
```

## Customizing the Design

### Layout

The CV is a single A4 page with two columns:
- **Sidebar** (left): name, photo, personal info, logo, QR code
- **Main content** (right): job title, summary, experience, skills, education

Layout is defined in Vue components (`src/components/`) — each section is its own component.

### Colors

All colors are CSS custom properties in `src/styles/cv.scss`:

```scss
:root {
  --color-header-bg: #3d4f5f;     // sidebar/header background
  --color-header-text: #ffffff;    // text on dark background
  --color-sidebar-bg: #f0f2f5;    // sidebar info section background
  --color-accent: #3d4f5f;        // section titles, bars, accents
  --color-main-text: #333333;     // body text
  --color-dates: #666666;         // dates, secondary text
}
```

Change these values to match your personal brand.

### Typography

Default is system fonts. To use a custom font:
1. Import it in `src/styles/cv.scss` (Google Fonts or local)
2. Update `--font-primary`

### Sizing

Key dimensions in CSS variables:
```scss
--page-width: 210mm;              // A4 width
--page-height: 297mm;             // A4 height
--sidebar-width: 52mm;            // sidebar column width
```

### Components

| Component | File | What it renders |
|-----------|------|-----------------|
| Sidebar | `src/components/CvSidebar.vue` | Name, photo, personal info, logo, QR |
| Experience | `src/components/CvExperience.vue` | Job entries with bullets |
| Skills | `src/components/CvSkills.vue` | 2-column skill categories |
| Education | `src/components/CvEducation.vue` | Diploma entries |

### Hidden Keywords (ATS)

Keywords from `config.yml` are rendered as invisible text (white on white) so ATS/AI resume parsers can read them but humans can't see them. This helps your CV pass automated screening.

## Project Structure

```
content/
  shared/                    # Your personal data (gitignored)
  examples/                  # Example content (committed, for reference)
  versions/                  # Your CV versions (gitignored)
src/
  components/                # Vue components
  styles/cv.scss             # All styling + CSS variables
  types/content.ts           # TypeScript interfaces
plugins/
  cv-content.ts              # Vite plugin — loads YAML/markdown at build time
scripts/
  generate-pdf.ts            # Playwright PDF generation
```

## Requirements

- Node.js 22+
- pnpm
- Playwright Chromium (`npx playwright install chromium`)

## License

MIT
