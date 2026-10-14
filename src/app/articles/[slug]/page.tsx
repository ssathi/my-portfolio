import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getArticleBySlug(params.slug)
  if (!article) {
    return { title: 'Article' }
  }
  return {
    title: `${article.title} — Satthi S`,
    description: article.subtitle,
  }
}

const categoryColors: Record<string, string> = {
  'Cloud & IaC': 'bg-[#ECFDF5] text-[#065F46] border-[#D1FAE5]',
  'DevOps & Systems': 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]',
  'Database Architecture': 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
  'Distributed Systems': 'bg-[#EFF6FF] text-[#1E40AF] border-[#DBEAFE]',
  'FinTech & Billing': 'bg-[#ECFEFF] text-[#155E75] border-[#CFFAFE]',
  'Healthcare & FHIR': 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]',
  'Data Engineering': 'bg-[#FFF7ED] text-[#9A3412] border-[#FFEDD5]',
}

export default function ArticlePage({ params }: PageProps) {
  const allArticles = getAllArticles();
  const articleIndex = allArticles.findIndex((a) => a.slug === params.slug);

  if (articleIndex === -1) notFound();

  const article = allArticles[articleIndex];
  const prevArticle = articleIndex > 0 ? allArticles[articleIndex - 1] : null;
  const nextArticle = articleIndex < allArticles.length - 1 ? allArticles[articleIndex + 1] : null;

  const badgeClass = categoryColors[article.category] || 'bg-[#F4F1EA] text-ink-700 border-[#E5E2DA]';

  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-ink-500 mb-8">
          <a href="/" className="hover:text-ink-900 transition-colors">Home</a>
          <span>/</span>
          <a href="/#articles" className="hover:text-ink-900 transition-colors">Articles</a>
          <span>/</span>
          <span className="text-ink-900 font-semibold truncate">{article.slug}</span>
        </nav>

        {/* Header */}
        <header className="mb-12 border-b border-[#E5E2DA] pb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeClass}`}>
              {article.category}
            </span>
            <span className="text-xs text-ink-500 font-mono">{article.readTime}</span>
            <span className="text-ink-300">•</span>
            <span className="text-xs text-ink-500 font-mono">{article.date}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-ink-900 tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-ink-600 leading-relaxed font-normal mb-8">
            {article.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#F4F1EA] text-ink-700 border border-[#E5E2DA]">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Metrics */}
        {article.metrics?.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xs font-mono uppercase tracking-wider text-ink-500 mb-4 font-semibold">Key Metrics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {article.metrics.map((m) => (
                <div key={m.label} className="p-4 rounded-xl bg-white border border-[#E5E2DA] shadow-sm">
                  <div className="text-xs text-ink-500 mb-1">{m.label}</div>
                  <div className="text-xl sm:text-2xl font-bold text-ink-900 font-mono">{m.value}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Body */}
        <article className="space-y-14 text-ink-700 leading-relaxed text-base">

          {article.overview && (
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#1E3A8A] rounded-full" />
                Overview
              </h2>
              <div className="p-6 rounded-xl bg-white border border-[#E5E2DA] text-ink-700 text-base leading-relaxed shadow-sm">
                {article.overview}
              </div>
            </section>
          )}

          {article.problem && (
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#92400E] rounded-full" />
                The Engineering Challenge
              </h2>
              <div className="p-6 rounded-xl bg-[#FFFDF5] border border-[#FDE68A] text-ink-800 space-y-4">
                {article.problem.split('\n\n').map((p, idx) => (
                  <p key={idx} className="whitespace-pre-line leading-relaxed">{p}</p>
                ))}
              </div>
            </section>
          )}

          {article.architecture && (
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#1E40AF] rounded-full" />
                System Design & Architecture
              </h2>
              <div className="rounded-xl bg-[#1E293B] p-5 sm:p-6 border border-[#334155] font-mono text-xs text-[#E2E8F0] overflow-x-auto shadow-inner leading-relaxed">
                <pre className="whitespace-pre">{article.architecture.replace(/```/g, '')}</pre>
              </div>
            </section>
          )}

          {article.implementation?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#1E3A8A] rounded-full" />
                Implementation
              </h2>
              <div className="space-y-8">
                {article.implementation.map((impl) => (
                  <div key={impl.title} className="rounded-xl bg-white p-6 border border-[#E5E2DA] shadow-sm">
                    <h3 className="text-lg font-bold text-ink-900 mb-2">{impl.title}</h3>
                    <p className="text-sm text-ink-600 mb-4 leading-relaxed">{impl.description}</p>
                    {impl.code && (
                      <div className="rounded-lg bg-[#0F172A] p-4 sm:p-5 border border-[#334155] font-mono text-xs text-[#E2E8F0] overflow-x-auto">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">
                          {impl.language || 'code'}
                        </div>
                        <pre className="whitespace-pre leading-relaxed">{impl.code}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {article.impact?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#065F46] rounded-full" />
                Impact & Results
              </h2>
              <ul className="space-y-3">
                {article.impact.map((item) => (
                  <li key={item} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E5E2DA] text-ink-800 text-sm shadow-sm">
                    <span className="text-[#059669] font-bold text-base mt-[-2px]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {article.lessons?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#5B21B6] rounded-full" />
                Key Takeaways
              </h2>
              <div className="space-y-3">
                {article.lessons.map((lesson, idx) => (
                  <div key={lesson} className="p-4 rounded-xl bg-[#F4F1EA] border border-[#E5E2DA] text-sm text-ink-700 leading-relaxed">
                    <strong className="text-ink-900">Takeaway {idx + 1}:</strong> {lesson}
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Prev / Next navigation */}
        <div className="mt-16 pt-8 border-t border-[#E5E2DA] flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevArticle ? (
            <a href={`/articles/${prevArticle.slug}`} className="w-full sm:w-auto p-4 rounded-xl bg-white border border-[#E5E2DA] hover:border-[#CFC9BC] shadow-sm flex flex-col text-left transition-all">
              <span className="text-[10px] font-mono uppercase text-ink-500">← Previous</span>
              <span className="text-sm font-bold text-ink-900 truncate max-w-xs">{prevArticle.title}</span>
            </a>
          ) : <div />}

          {nextArticle && (
            <a href={`/articles/${nextArticle.slug}`} className="w-full sm:w-auto p-4 rounded-xl bg-white border border-[#E5E2DA] hover:border-[#CFC9BC] shadow-sm flex flex-col text-right sm:items-end transition-all">
              <span className="text-[10px] font-mono uppercase text-ink-500">Next →</span>
              <span className="text-sm font-bold text-ink-900 truncate max-w-xs">{nextArticle.title}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
