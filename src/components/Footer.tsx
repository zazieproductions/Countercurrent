import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t-[3px] border-[#191712] bg-[#191712] text-[#f2eee2] no-print">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#e8b4a6] mb-2">Countercurrent · CC-001 — CC-168</p>
          <p className="font-serif font-black text-3xl leading-none mb-3">Countercurrent</p>
          <p className="font-serif text-[15px] leading-relaxed opacity-80 max-w-sm">An independent journal of experimental and avant-garde music, published from London since 2011. Reviews, features, essays, and columns on the underground past and present. No ads, no sponsors, no scores-for-hire.</p>
          <p className="font-mono text-[11px] mt-4 opacity-60 leading-relaxed">Factual metadata (dates, labels, personnel) is checked against sleeves and primary sources. Critical commentary is the signed opinion of its writer. We never invent quotations, interviews, or artist statements.</p>
        </div>
        <nav className="md:col-span-2" aria-label="Sections">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-60 mb-3">Sections</p>
          <ul className="space-y-1.5 font-serif text-[15px]">
            {[['/reviews','Reviews'],['/features','Features'],['/essays','Essays'],['/news','News'],['/columns','Columns'],['/archive','Full archive']].map(([to,l]) => <li key={to}><Link className="hover:underline" to={to}>{l}</Link></li>)}
          </ul>
        </nav>
        <nav className="md:col-span-2" aria-label="Reference">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-60 mb-3">Reference</p>
          <ul className="space-y-1.5 font-serif text-[15px]">
            {[['/artists','Artists'],['/releases','Releases'],['/labels','Labels'],['/genres','Genre desks'],['/writers','Writers'],['/search','Search']].map(([to,l]) => <li key={to}><Link className="hover:underline" to={to}>{l}</Link></li>)}
          </ul>
        </nav>
        <nav className="md:col-span-2" aria-label="About">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-60 mb-3">Publication</p>
          <ul className="space-y-1.5 font-serif text-[15px]">
            {[['/about','About & ethics'],['/about#ratings','How we rate'],['/about#masthead','Masthead'],['/about#write','Write for us'],['/archive','Back numbers']].map(([to,l]) => <li key={to}><Link className="hover:underline" to={to}>{l}</Link></li>)}
          </ul>
        </nav>
        <div className="md:col-span-2">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-60 mb-3">Colophon</p>
          <div className="border border-[#f2eee2]/30 p-3 font-mono text-[11px] leading-relaxed opacity-80">
            <p>Set in Newsreader, Archivo &amp; Plex Mono</p>
            <p className="mt-2">Printed on pixels · bound by links</p>
            <p className="mt-2 text-[#e8b4a6]">© 2011–2026 Countercurrent</p>
          </div>
        </div>
      </div>
      <div className="border-t border-[#f2eee2]/20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10.5px] tracking-[0.12em] uppercase opacity-60">
          <span>All criticism signed &amp; dated</span><span>Facts checked · opinions owned</span><span>Corrections printed</span>
        </div>
      </div>
    </footer>
  );
}