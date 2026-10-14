'use client'

import { useState } from 'react'
import type { Article } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'

interface ArticleGridProps {
  articles: Article[]
}

export default function ArticleGrid ({ articles }: ArticleGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const allCategories = ['All', ...Array.from(new Set(articles.map((article) => article.category)))]

  const filtered = selectedCategory === 'All'
    ? articles
    : articles.filter((article) => article.category === selectedCategory)

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category)
  }

  const handleFilterKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, category: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelectCategory(category)
    }
  }

  return (
    <section id="articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#E5E2DA] pb-6">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">Engineering Articles</h2>
          <p className="text-ink-500 text-sm mt-1">
            {articles.length} articles · latest first
          </p>
        </div>

        <div
          className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#F0EDE5] border border-[#E5E2DA]"
          role="tablist"
          aria-label="Filter articles by category"
        >
          {allCategories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              tabIndex={0}
              onClick={() => handleSelectCategory(category)}
              onKeyDown={(event) => handleFilterKeyDown(event, category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-white text-ink-900 shadow-sm border border-[#E5E2DA]'
                  : 'text-ink-600 hover:text-ink-900 hover:bg-white/60'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  )
}
