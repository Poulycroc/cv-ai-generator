# CV Generator

Markdown-driven CV/resume builder. Content in YAML/markdown, rendered as A4 HTML, exported to PDF via Playwright.

## Stack

- Vite 6 + Vue 3 + TypeScript + SCSS
- pnpm
- Vite plugin (`plugins/cv-content.ts`) loads content into `virtual:cv-content`
- Playwright for PDF generation

## Commands

- `pnpm dev` — preview default version
- `CV_VERSION=<name> pnpm dev` — preview specific version
- `pnpm generate <name>` — generate CV PDF to `content/versions/<name>/generated/`
- `pnpm generate:cover-letter <name>` — generate cover letter PDF + TXT to `content/versions/<name>/generated/`

## Content Structure

```
content/
  shared/
    sidebar.yml              # personal info (shared across all versions)
    profile-pic.jpg          # profile photo (imported in CvSidebar.vue)
    cv_logo.svg              # logo displayed in sidebar
    experience-database.md   # FULL experience history — source of truth for all CVs
  versions/
    <version-name>/
      config.yml         # lang, keywords, section file refs
      title.md           # job title + summary paragraphs
      experience.md      # selected work experience for this version
      skills.md          # technical skills, reordered for this version
      education.md       # diplomas/education
      cover-letter.md    # optional — cover letter content
      generated/         # PDF + TXT output folder
```

## Creating a New CV Version

When asked to generate a CV for a job offer:

### Step 0: Research
**ALWAYS do this first:**
- Read `content/shared/preferences.md` — user's personal CV generation preferences
- Read `content/shared/experience-database.md` — full experience pool
- Read ALL existing `content/versions/*/title.md`, `experience.md`, `skills.md` — learn from past adaptations
- Identify what worked well and reuse/improve

### Step 1: Create version folder
`content/versions/<slug>/generated/`

Naming: `<role>-<stack>-<lang>` (e.g., `fullstack-laravel-fr`, `react-senior-en`)

### Step 2: Create adapted files

#### config.yml
```yaml
lang: fr  # or en

keywords:
  # ATS-targeted invisible keywords extracted from the job offer
  # These are rendered white-on-white — invisible but selectable by parsers

sidebar_overrides:  # optional, for EN versions or per-offer tweaks
  # Override any field from shared/sidebar.yml here

sections:
  title: ./title.md
  experience: ./experience.md
  skills: ./skills.md
  education: ./education.md
```

#### title.md
- `jobTitle` in frontmatter: adapted to match the offer's terminology
- Body: 2-3 short paragraphs summarizing the profile, tailored to what the offer values most
- Match the offer's tone (backend-first? frontend? fullstack? leadership?)

#### experience.md
- Pick 4-5 most relevant entries from `experience-database.md`
- **Order** by relevance to the offer, not chronology
- **Rephrase bullets** to highlight skills the offer asks for
- **Include specific tech** from each role that matches the offer
- Can merge similar roles (e.g., multiple teaching positions) to save space
- **Never invent experience** — only reframe real work from the database
- Borrow good phrasing from previous versions when relevant

#### skills.md
- Same skill categories, reordered by relevance to the offer
- Put the stack the offer wants FIRST
- Add methodology from offer if relevant (Shape Up, Kanban, etc.)
- Apply rules from `content/shared/preferences.md`

#### education.md
- Usually the same across versions unless offer requires specific highlighting

#### cover-letter.md (optional)
Only create when the user requests a cover letter.

```markdown
---
recipient: Company Name
city: City
date: May 13, 2026
---

Cover letter body in markdown. Multiple paragraphs supported.
```

- Frontmatter: `recipient` (company), `city`, `date`
- Body: tailored letter content matching the offer's tone and requirements
- Sender info (name, address, email, website) is pulled from `sidebar.yml` + overrides
- Generate with: `pnpm generate:cover-letter <version>`
- Outputs both PDF (styled A4 letter) and TXT (plain text for textarea paste) to `generated/`

## Important Rules

- **Never invent experience** — only reframe real work from experience-database.md
- **Read preferences.md** — apply user's personal CV style preferences
- **Read existing versions first** — each new CV builds on past work
- **All content must fit on a single A4 page**
- **Keywords are invisible** (white on white) for ATS/AI resume parsers
- **sidebar_overrides in config.yml** can override shared sidebar fields (useful for i18n)
- Use pnpm, never npm
