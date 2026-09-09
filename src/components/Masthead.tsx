import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

const NAV: [string, string][] = [
  ['/reviews', 'Reviews'],
  ['/features', 'Features'],
  ['/essays', 'Essays'],
  ['/news', 'News'],
  ['/columns', 'Columns'],
  ['/archive', 'Archive'],
  ['/artists', 'Artists'],
  ['/labels', 'Labels'],
  ['/genres', 'Desks'],
  ['/writers', 'Writers'],
  ['/about', 'About'],
];

export default function Masthead({ issueNo = 168 }: { issueNo?: number }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const nav = useNavigate();
  return (
    <header className="no-print">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[#191712] focus:text-[#f2eee2] focus:px-3 focus:py-2 focus:text-sm">Skip to content</a>
      <div className="bg-[#191712] text-[#f2eee2]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 flex items-center justify-between h-9 font-mono text-[11px] tracking-[0.12em] uppercase">
          <span className="hidden sm:inline">Est. 2011 · Independent · No ads, no sponsors</span>
          <span className="sm:hidden">Est. 2011 · Independent</span>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline opacity-70">London · Rotterdam · Kyoto · New York</span>
            <span className="text-[#e8b4a6]">Issue CC-{issueNo}</span>
            <span className="hidden sm:inline opacity-70">9 Sept 2026</span>
          </div>
        </div>
      </div>
      <div className="border-b-[3px] border-[#191712]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 pt-5 pb-4">
          <div className="flex items-end justify-between gap-4">
            <Link to="/" className="block leading-none" aria-label="Countercurrent home">
              <span className="block font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-[#a9321f] mb-1">Experimental &amp; avant-garde music · since 2011</span>
              <span className="block font-serif font-black headline-tight text-[42px] md:text-[68px] tracking-[-0.03em]">Countercurrent</span>
            </Link>
            <div className="hidden lg:block text-right font-mono text-[11px] leading-relaxed text-[#3d3a30] pb-1">
              <p>Reviews · Features · Essays · Columns</p>
              <p className="opacity-70">Print spirit, web archive · CC-001 — CC-{issueNo}</p>
              <form
                className="mt-2 flex items-center gap-2 justify-end"
                onSubmit={(e) => { e.preventDefault(); if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`); }}
                role="search"
              >
                <label htmlFor="mast-search" className="sr-only">Search the archive</label>
                <input id="mast-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the archive — artists, labels, techniques…" className="w-64 bg-transparent border border-[#191712]/40 px-2 py-1 font-mono text-[11px] placeholder:text-[#6f6a5b] focus:outline-none focus:border-[#a9321f]" />
                <button type="submit" className="border border-[#191712] px-2 py-1 hover:bg-[#191712] hover:text-[#f2eee2] transition-colors" aria-label="Search"><Search size={13} /></button>
              </form>
            </div>
            <div className="flex lg:hidden items-center gap-2 pb-2">
              <button onClick={() => nav('/search')} aria-label="Search" className="p-2 border border-[#191712]"><Search size={16} /></button>
              <button onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} className="p-2 border border-[#191712]">{open ? <X size={16} /> : <Menu size={16} />}</button>
            </div>
          </div>
        </div>
        <nav aria-label="Sections" className="hidden lg:block border-t border-[#191712]">
          <div className="max-w-[1280px] mx-auto px-4 md:px-6 flex items-center gap-1 overflow-x-auto thin-scroll">
            {NAV.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `font-mono text-[11.5px] tracking-[0.12em] uppercase px-3 py-2.5 whitespace-nowrap border-r border-[#191712]/15 first:border-l hover:bg-[#191712] hover:text-[#f2eee2] transition-colors ${isActive ? 'bg-[#191712] text-[#f2eee2]' : ''}`}>{label}</NavLink>
            ))}
          </div>
        </nav>
        {open && (
          <nav aria-label="Mobile sections" className="lg:hidden border-t border-[#191712] bg-[#efe7d3]">
            <div className="grid grid-cols-2 font-mono text-[12px] uppercase tracking-[0.1em]">
              {NAV.map(([to, label]) => (
                <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `px-4 py-3 border-b border-[#191712]/15 ${isActive ? 'bg-[#191712] text-[#f2eee2]' : ''}`}>{label}</NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}