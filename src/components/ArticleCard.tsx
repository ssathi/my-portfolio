import Link from 'next/link'
import type { Article } from '@/lib/articles'

interface ArticleCardProps {
  article: Article
}

const categoryColors: Record<string, string> = {
  'Cloud & IaC': 'bg-[#ECFDF5] text-[#065F46] border-[#D1FAE5]',
  'DevOps & Systems': 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]',
  'Database Architecture': 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
  'Distributed Systems': 'bg-[#EFF6FF] text-[#1E40AF] border-[#DBEAFE]',
  'FinTech & Billing': 'bg-[#ECFEFF] text-[#155E75] border-[#CFFAFE]',
  'Healthcare & FHIR': 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]',
  'Data Engineering': 'bg-[#FFF7ED] text-[#9A3412] border-[#FFEDD5]',
  'Python & Django': 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
}

export default function ArticleCard ({ article }: ArticleCardProps) {
  const badgeClass = categoryColors[article.category] || 'bg-[#F4F1EA] text-ink-700 border-[#E5E2DA]'
  const previewMetrics = article.metrics.slice(0, 2)
  const previewTags = article.tags.slice(0, 3)

  return (
    <Link
      href={`/articles/${article.slug}`}
      aria-label={`Read article: ${article.title}`}
      className="group block rounded-xl p-6 editorial-card flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${badgeClass}`}>
            {article.category}
          </span>
          <div className="text-[11px] text-ink-500 font-mono">
            {article.date} · {article.readTime}
          </div>
        </div>

        <h3 className="text-lg font-bold text-ink-900 group-hover:text-[#1E3A8A] transition-colors mb-2 leading-snug">
          {article.title}
        </h3>

        <p className="text-ink-600 text-xs leading-relaxed mb-5 line-clamp-3">
          {article.subtitle}
        </p>
      </div>

      <div>
        {previewMetrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-lg bg-[#FAF9F5] border border-[#EBE8E0]">
            {previewMetrics.map((metric) => (
              <div key={metric.label} className="text-left">
                <div className="text-[10px] text-ink-500 font-medium truncate uppercase tracking-wider">{metric.label}</div>
                <div className="text-sm font-bold text-ink-900 font-mono mt-0.5">{metric.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#EBE8E0]">
          {previewTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F4F1EA] text-ink-700 border border-[#E5E2DA]"
            >
              #{tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-ink-500">
              +{article.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
