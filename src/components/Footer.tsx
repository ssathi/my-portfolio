import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E2DA] bg-[#FAF9F5] py-12 text-ink-600 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded bg-[#1E3A8A] flex items-center justify-center font-mono font-bold text-white text-xs shadow-sm">
                SS
              </div>
              <span className="font-bold text-ink-900 text-base">Satthi S</span>
            </div>
            <p className="text-ink-600 text-xs leading-relaxed max-w-sm">
              Principal Software Engineer based in Singapore. Building distributed systems, cloud infrastructure,
              and domain-driven platforms across healthcare, fintech, and enterprise.
            </p>
          </div>

          <div>
            <h4 className="text-ink-900 text-xs font-semibold uppercase tracking-wider mb-3">Engineering Domains</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/#articles" className="hover:text-ink-900 transition-colors">Distributed Systems & Databases</a></li>
              <li><a href="/#articles" className="hover:text-ink-900 transition-colors">Cloud Infrastructure & IaC</a></li>
              <li><a href="/#articles" className="hover:text-ink-900 transition-colors">Healthcare & FHIR Standards</a></li>
              <li><a href="/#articles" className="hover:text-ink-900 transition-colors">FinTech & Payment Systems</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-ink-900 text-xs font-semibold uppercase tracking-wider mb-3">Contact</h4>
            <div className="space-y-2 text-xs">
              <div><a href="mailto:ssatthy@gmail.com" className="hover:text-ink-900 transition-colors">ssatthy@gmail.com</a></div>
              <div><a href="tel:+6583712348" className="hover:text-ink-900 transition-colors">+65 8371 2348</a></div>
              <div><a href="https://www.linkedin.com/in/ssatthy" target="_blank" rel="noopener noreferrer" className="hover:text-ink-900 transition-colors">linkedin.com/in/ssatthy</a></div>
              <div><a href="https://github.com/ssathi" target="_blank" rel="noopener noreferrer" className="hover:text-ink-900 transition-colors">github.com/ssathi</a></div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5E2DA] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-500 gap-4">
          <p>© 2026 Satthi S. All rights reserved.</p>
          <span className="px-2 py-0.5 rounded bg-[#F4F1EA] text-ink-600 font-mono text-[11px] border border-[#E5E2DA]">
            Next.js 14 · Tailwind CSS · TypeScript
          </span>
        </div>
      </div>
    </footer>
  );
}
