import { getAllArticles, hasProfilePhoto } from '@/lib/articles'
import ArticleGrid from '@/components/ArticleGrid'

const domainTags = [
  { label: 'Distributed Systems', bg: 'bg-[#EFF6FF]', text: 'text-[#1E40AF]', border: 'border-[#DBEAFE]' },
  { label: 'Cloud & IaC', bg: 'bg-[#ECFDF5]', text: 'text-[#065F46]', border: 'border-[#D1FAE5]' },
  { label: 'Database Architecture', bg: 'bg-[#FFFBEB]', text: 'text-[#92400E]', border: 'border-[#FDE68A]' },
  { label: 'FinTech & Payments', bg: 'bg-[#ECFEFF]', text: 'text-[#155E75]', border: 'border-[#CFFAFE]' },
  { label: 'Healthcare & FHIR', bg: 'bg-[#F5F3FF]', text: 'text-[#5B21B6]', border: 'border-[#DDD6FE]' },
  { label: 'Data Engineering', bg: 'bg-[#FFF7ED]', text: 'text-[#9A3412]', border: 'border-[#FFEDD5]' },
  { label: 'DevOps & Systems', bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]', border: 'border-[#FEE2E2]' },
]

export default function HomePage () {
  const articles = getAllArticles()
  const showProfilePhoto = hasProfilePhoto()

  return (
    <div className="pb-20">
      {/* Editorial Hero Section */}
      <section className="relative pt-12 pb-6 border-b border-[#E5E2DA] bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="flex-shrink-0">
              {showProfilePhoto ? (
                <img
                  src="/profile.jpg"
                  alt="Satthi S"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full border-2 border-[#E5E2DA] object-cover shadow-sm"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="w-24 h-24 rounded-full bg-[#1E3A8A] flex items-center justify-center text-2xl font-bold text-white border-2 border-[#DBEAFE] shadow-sm font-mono"
                >
                  SS
                </div>
              )}
            </div>

            <div className="max-w-3xl">
              <p className="text-[#1E3A8A] font-mono text-xs font-semibold uppercase tracking-wider mb-1.5">
                Principal Software Engineer · Singapore
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight mb-3 leading-tight font-sans">
                Satthi S
              </h1>
              <p className="text-ink-600 text-base leading-relaxed">
                Building distributed systems, cloud infrastructure, and domain-driven platforms across
                healthcare, fintech, and enterprise. This is my engineering journal — documenting architectures,
                deep technical trade-offs, and lessons from production.
              </p>
            </div>
          </div>

          {/* Domain Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {domainTags.map((tag) => (
              <span
                key={tag.label}
                className={`px-3 py-1 text-xs font-medium rounded-full border ${tag.bg} ${tag.text} ${tag.border}`}
              >
                {tag.label}
              </span>
            ))}
          </div>

          {/* Contact Row */}
          <div className="flex flex-wrap gap-6 text-xs text-ink-600 font-medium pt-2">
            <a
              href="mailto:ssatthy@gmail.com"
              className="flex items-center gap-2 hover:text-ink-900 transition-colors"
            >
              <svg className="w-4 h-4 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              ssatthy@gmail.com
            </a>
            <a
              href="tel:+6583712348"
              className="flex items-center gap-2 hover:text-ink-900 transition-colors"
            >
              <svg className="w-4 h-4 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +65 8371 2348
            </a>
            <a
              href="https://www.linkedin.com/in/ssatthy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-ink-900 transition-colors"
            >
              <svg className="w-4 h-4 text-[#1E3A8A]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              linkedin.com/in/ssatthy
            </a>
            <a
              href="https://github.com/ssathi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-ink-900 transition-colors"
            >
              <svg className="w-4 h-4 text-[#1E3A8A]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              github.com/ssathi
            </a>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <ArticleGrid articles={articles} />
    </div>
  )
}
