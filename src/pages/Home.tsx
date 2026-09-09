import { Link } from 'react-router-dom';
import { getDB } from '../lib/db';
import { Byline, SectionHead, TypeTag } from '../components/Chrome';
import { LeadCard, StandardCard, CompactRow } from '../components/Cards';
import { FromArchive } from '../components/Sidebars';
import { SECTION_FOR_TYPE } from '../lib/types';

export default function Home() {
  const db = getDB();
  const lead = db.articlesById.get('a001')!;
  const secondaryIds = ['a002', 'a003', 'a004'];
  const secondary = secondaryIds.map((id) => db.articlesById.get(id)!);
  const latest = db.articles.slice(0, 8);
  const editorsPicks = db.articles.filter((a) => a.editorsPick && a.id !== 'a001').slice(0, 4);
  const columns = db.articles.filter((a) => a.type === 'column').slice(0, 4);
  const technical = db.articles.filter((a) => a.type === 'technical').slice(0, 3);
  const shorts = db.articles.filter((a) => a.type === 'short-review').slice(0, 6);
  const news = db.articles.filter((a) => a.type === 'news').slice(0, 3);
  const genreSample = ['noise', 'musique-concrete', 'drone', 'idm', 'free-improv', 'shoegaze'];
  return (
    <div>
      <section aria-label="Lead story" className="border-b-[2.5px] border-[#191712] pb-6 mb-6">
        <LeadCard article={lead} />
      </section>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <section aria-label="Secondary features">
            <div className="grid md:grid-cols-3 gap-6">
              {secondary.map((a) => (
                <article key={a.id} className="border-t-[2.5px] border-[#191712] pt-3">
                  <div className="flex items-center gap-2 mb-2"><TypeTag type={a.type} />{a.rating !== undefined && <span className="font-mono text-[12px] font-semibold text-[#a9321f]">{a.rating.toFixed(1)}</span>}</div>
                  <Link to={`/articles/${a.slug}`}><h3 className="font-serif font-black text-[21px] leading-[1.08] tracking-tight hover:text-[#a9321f] hover:underline underline-offset-4">{a.title}</h3></Link>
                  <p className="font-serif text-[14.5px] text-[#3d3a30] leading-relaxed mt-2 clamp-3">{a.dek}</p>
                  <div className="mt-2"><Byline article={a} /></div>
                </article>
              ))}
            </div>
          </section>

          <section aria-label="The latest" className="mt-10">
            <SectionHead kicker="The wire · updated continuously" title="The Latest" more="All sections" moreTo="/archive" />
            <div className="grid md:grid-cols-2 gap-x-8">
              {latest.map((a) => <StandardCard key={a.id} article={a} />)}
            </div>
          </section>

          <section aria-label="Short reviews" className="mt-10 bg-[#efe7d3] border border-[#191712] p-5">
            <SectionHead kicker="Capsules · 150 words, no filler" title="Short Reviews" more="All reviews" moreTo="/reviews" />
            <div className="grid md:grid-cols-2 gap-x-8">
              {shorts.map((a) => <StandardCard key={a.id} article={a} showDek={false} />)}
            </div>
          </section>

          <section aria-label="Technical examinations" className="mt-10">
            <SectionHead kicker="Signal Path & methods" title="How It Was Made" more="Essays & technical" moreTo="/essays" />
            {technical.map((a) => <StandardCard key={a.id} article={a} />)}
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section aria-label="Editors picks" className="border border-[#191712] bg-[#191712] text-[#f2eee2] p-5">
            <p className="kicker text-[10px] text-[#e8b4a6] mb-1">Editors' picks</p>
            <h2 className="font-serif font-black text-[22px] leading-tight mb-3">What the desk keeps returning to</h2>
            {editorsPicks.map((a) => (
              <article key={a.id} className="py-2.5 border-t border-[#f2eee2]/20 first:border-t-0">
                <Link to={`/articles/${a.slug}`} className="font-serif font-bold text-[16px] leading-snug hover:underline underline-offset-2">{a.title}</Link>
                <p className="font-mono text-[10px] tracking-[0.08em] uppercase opacity-60 mt-1">{db.writers.get(a.writerId)?.name} · {a.catalogNo}</p>
              </article>
            ))}
          </section>

          <section aria-label="Columns">
            <SectionHead kicker="Recurring" title="Columns" more="All columns" moreTo="/columns" />
            <div>{columns.map((a) => <CompactRow key={a.id} article={a} />)}</div>
          </section>

          <section aria-label="News desk" className="border border-dashed border-[#191712]/50 p-4">
            <p className="kicker text-[10px] text-[#a9321f] mb-2">News desk · sourced, not rumoured</p>
            {news.map((a) => <CompactRow key={a.id} article={a} />)}
          </section>

          <nav aria-label="Genre desks">
            <p className="kicker text-[10px] text-[#6f6a5b] mb-2">Browse by desk</p>
            <div className="flex flex-wrap gap-1.5">
              {genreSample.map((g) => (
                <Link key={g} to={`/genres/${g}`} className="font-mono text-[10.5px] tracking-[0.06em] uppercase border border-[#191712]/30 px-2 py-1 hover:bg-[#191712] hover:text-[#f2eee2] transition-colors">{db.genres.get(g)?.short}</Link>
              ))}
              <Link to="/genres" className="font-mono text-[10.5px] tracking-[0.06em] uppercase border border-[#a9321f] text-[#a9321f] px-2 py-1 hover:bg-[#a9321f] hover:text-[#f2eee2] transition-colors">All 20 desks →</Link>
            </div>
          </nav>

          <FromArchive excludeId={lead.id} count={4} />
        </div>
      </div>

      <section aria-label="More from the sections" className="mt-12 grid md:grid-cols-3 gap-8">
        {[['Reviews', 'reviews'], ['Features', 'features'], ['Essays', 'essays']].map(([label, path]) => (
          <div key={path}>
            <SectionHead kicker={`Section`} title={label} more={`More ${label.toLowerCase()}`} moreTo={`/${path}`} />
            {db.articles.filter((a) => (SECTION_FOR_TYPE[a.type] || '').toLowerCase() === (label as string).toLowerCase() || (label === 'Reviews' && (a.type === 'review' || a.type === 'short-review'))).slice(0, 3).map((a) => <CompactRow key={a.id} article={a} />)}
          </div>
        ))}
      </section>
    </div>
  );
}