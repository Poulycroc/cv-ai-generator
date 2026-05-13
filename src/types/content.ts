export interface Language {
  name: string
  level: string
  bar: number
}

export interface SidebarData {
  name: string
  birthdate: string
  address: string
  phone: string
  email: string
  website: string
  qr_url: string
  languages: Language[]
  mobility: string
  interests: string[]
  photo: string
  logo: string
  photoDataUrl: string
  logoSvg: string
  qrSvg: string
}

export interface VersionConfig {
  lang: 'fr' | 'en'
  keywords: string[]
  sidebar_overrides?: Partial<SidebarData>
}

export interface TitleData {
  jobTitle: string
  summaryHtml: string
}

export interface ExperienceEntry {
  role: string
  dates: string
  company: string
  bullets: string[]
}

export interface ExperienceData {
  sectionTitle: string
  entries: ExperienceEntry[]
}

export interface SkillCategory {
  name: string
  items: string[]
}

export interface SkillsData {
  sectionTitle: string
  categories: SkillCategory[]
}

export interface EducationEntry {
  school: string
  program: string
  dates: string
}

export interface EducationData {
  sectionTitle: string
  entries: EducationEntry[]
}

export interface CoverLetterSender {
  name: string
  address: string
  email: string
  website: string
}

export interface CoverLetterData {
  sender: CoverLetterSender
  recipient: string
  city: string
  date: string
  bodyHtml: string
  bodyText: string
}

export interface CvContent {
  sidebar: SidebarData
  config: VersionConfig
  title: TitleData
  experience: ExperienceData
  skills: SkillsData
  education: EducationData
}
