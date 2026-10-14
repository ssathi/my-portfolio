import fs from 'fs'
import path from 'path'

export interface Article {
  id: number
  number: string
  slug: string
  title: string
  subtitle: string
  category: string
  date: string
  readTime: string
  tags: string[]
  metrics: { label: string; value: string }[]
  overview: string
  problem: string
  architecture: string
  implementation: {
    title: string
    description: string
    code?: string
    language?: string
  }[]
  impact: string[]
  lessons: string[]
}

const articlesDir = path.join(process.cwd(), 'data', 'articles')

const parseArticleFile = (filename: string): Article | null => {
  if (filename === 'index.json' || !filename.endsWith('.json')) {
    return null
  }

  const filePath = path.join(articlesDir, filename)
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Partial<Article>

  if (!parsed.slug || !parsed.title) {
    return null
  }

  const match = filename.match(/^(\d+)/)
  const number = parsed.number || match?.[1] || '0'
  const id = parsed.id ?? parseInt(number, 10)

  return {
    id,
    number,
    slug: parsed.slug,
    title: parsed.title,
    subtitle: parsed.subtitle || '',
    category: parsed.category || 'Engineering',
    date: parsed.date || '',
    readTime: parsed.readTime || '',
    tags: parsed.tags || [],
    metrics: parsed.metrics || [],
    overview: parsed.overview || '',
    problem: parsed.problem || '',
    architecture: parsed.architecture || '',
    implementation: parsed.implementation || [],
    impact: parsed.impact || [],
    lessons: parsed.lessons || [],
  }
}

const extractDateWeight = (dateStr: string): number => {
  if (!dateStr) return 0
  const matches = dateStr.match(/\d{4}/g)
  if (!matches || matches.length === 0) return 0
  return Math.min(...matches.map((year) => parseInt(year, 10)))
}

export const getAllArticles = (): Article[] => {
  if (!fs.existsSync(articlesDir)) {
    return []
  }

  const list = fs
    .readdirSync(articlesDir)
    .map(parseArticleFile)
    .filter((article): article is Article => article !== null)

  list.sort((a, b) => {
    const dateWeightA = extractDateWeight(a.date)
    const dateWeightB = extractDateWeight(b.date)
    if (dateWeightB !== dateWeightA) {
      return dateWeightB - dateWeightA
    }
    return b.id - a.id
  })

  return list
}

export const getArticleBySlug = (slug: string): Article | undefined => {
  return getAllArticles().find((article) => article.slug === slug)
}

export const hasProfilePhoto = (): boolean => {
  return fs.existsSync(path.join(process.cwd(), 'public', 'profile.jpg'))
}
