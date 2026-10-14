import { getAllArticles } from '@/lib/articles'

export default function Navbar () {
  const articleCount = getAllArticles().length

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E5E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <a href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center font-mono font-bold text-white text-xs shadow-sm group-hover:bg-[#172554] transition-colors">
            SS
          </div>
          <div>
            <div className="font-semibold text-ink-900 text-sm tracking-tight leading-tight group-hover:text-navy transition-colors">
              Satthi S
            </div>
            <div className="text-[11px] text-ink-500 font-mono leading-tight">
              Principal Software Engineer · Singapore
            </div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-ink-600">
          <a href="/#articles" className="px-3 py-1.5 rounded-lg hover:text-ink-900 hover:bg-[#EFECE4] transition-colors flex items-center gap-1.5">
            <span>Articles</span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-[#E5E2DA] text-ink-700 rounded-full font-semibold">{articleCount}</span>
          </a>
          <a href="https://github.com/ssathi" target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg hover:text-ink-900 hover:bg-[#EFECE4] transition-colors">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/ssatthy" target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg hover:text-ink-900 hover:bg-[#EFECE4] transition-colors">
            LinkedIn
          </a>
          <a href="mailto:ssatthy@gmail.com"
            className="ml-3 px-3.5 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-medium transition-colors shadow-sm">
            Contact
          </a>
        </nav>

        {/* Mobile menu link */}
        <a href="mailto:ssatthy@gmail.com" className="md:hidden px-3 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-medium transition-colors">
          Contact
        </a>
      </div>
    </header>
  );
}
