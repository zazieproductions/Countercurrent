import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDB } from '../lib/db';
import { Breadcrumbs, SectionHead, TypeTag } from '../components/Chrome';
import { StandardCard } from '../components/Cards';
import { TYPE_LABELS, type ArticleType } from '../lib/types';

function Section({ title, kicker, intro, types, path, crumbs }: { title: string; kicker: string; intro: string; types: ArticleType[]; path: string; crumbs: [string, string?][] }) {
  const db = getDB();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sort, setSort] = useState<'new' | 'top'>('new');
  const pool = useMemo(() => db.articles.filter((a) => types.includes(a.type)), [db, types]);
  const typesPresent = useMemo(() => [...new Set(pool.map((a) => a.type))], [pool]);
  const list = useMemo(() => {
    let l = typeFilter === 'all' ? [...pool] : pool.filter((a) => a.type === typeFilter);
    if (sort === 'top') l = l.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    else l = l.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    return l;
  }, [pool, typeFilter, sort]);
  const [shown, setShown] = useState(14);
  return (
    <div>
      <Breadcrumbs trail={crumbs} />
      <header className="mt-3 border-b-[2.5px] border-[#191712] pb-5 mb-5">
        <p className="kicker text-[10.5px] text-[#a9321f] mb-1">{kicker}</p>
        <h1 className="font-serif font-black headline-tight text-[38px] md:text-[54px]">{title}</h1>
        <p className="font-serif text-[17px] text-[#3d3a30] leading-relaxed mt-3 max-w-3xl">{intro}</p>
        <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#6f6a5b] mt-2">{pool.length} pieces · CC-001 — CC-168</p>
      </header>
      <div className="flex flex-wrap items-center gap-2 mb-5 no-print">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#6f6a5b]">Filter:</span>
        <button onClick={() => { setTypeFilter('all'); setShown(14); }} className={`font-mono text-[11px] uppercase tracking-[0.06em] border px-2.5 py-1 ${typeFilter === 'all' ? 'bg-[#191712] text-[#f2eee2] border-[#191712]' : 'border-[#191712]/30'}`}>All</button>
        {typesPresent.map((t) => (
          <button key={t} onClick={() => { setTypeFilter(t); setShown(14); }} className={`font-mono text-[11px] uppercase tracking-[0.06em] border px-2.5 py-1 ${typeFilter === t ? 'bg-[#191712] text-[#f2eee2] border-[#191712]' : 'border-[#191712]/30'}`}>{TYPE_LABELS[t]}</button>
        ))}
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#6f6a5b] ml-3">Sort:</span>
        <button onClick={() => setSort('new')} className={`font-mono text-[11px] uppercase tracking-[0.06em] border px-2.5 py-1 ${sort === 'new' ? 'bg-[#a9321f] text-[#f2eee2] border-[#a9321f]' : 'border-[#191712]/30'}`}>Newest</button>
        <button onClick={() => setSort('top')} className={`font-mono text-[11px] uppercase tracking-[0.06em] border px-2.5 py-1 ${sort === 'top' ? 'bg-[#a9321f] text-[#f2eee2] border-[#a9321f]' : 'border-[#191712]/30'}`}>Top rated</button>
      </div>
      <div className="grid md:grid-cols-2 gap-x-8">
        {list.slice(0, shown).map((a) => <StandardCard key={a.id} article={a} />)}
      </div>
      {shown < list.length && <button onClick={() => setShown((s) => s + 16)} className="mt-6 font-mono text-[11px] tracking-[0.14em] uppercase border border-[#191712] px-5 py-2.5 hover:bg-[#191712] hover:text-[#f2eee2] transition-colors">Show more ({list.length - shown} remaining)</button>}
    </div>
  );
}

export function Reviews() {
  return <Section title="Reviews" kicker="The review desk · long & short" path="/reviews" crumbs={[['Reviews']]} types={['review', 'short-review']} intro="Substantial reviews that describe production, instrumentation, method, timbre, structure and lineage — plus 150-word capsules for the rest of the inbox. Scores run 0–10 and mean what they say." />;
}
export function Features() {
  return <Section title="Features" kicker="Retrospectives · primers · scenes · labels · lists" path="/features" crumbs={[['Features']]} types={['feature', 'retrospective', 'primer', 'label-profile', 'scene-history', 'list', 'rediscovery']} intro="Slow journalism: retrospectives, artist primers, scene histories, label profiles, archival rediscoveries and graded entry-point lists. The pieces other publications cite." />;
}
export function Essays() {
  return <Section title="Essays" kicker="Arguments · techniques · ethics" path="/essays" crumbs={[['Essays']]} types={['essay', 'technical']} intro="Longer arguments and technical examinations — Signal Path studio craft, tuning theory, reissue ethics, dub mixing desks. Opinionated, sourced, and specific about method." />;
}
export function News() {
  return <Section title="News" kicker="The news desk · sourced, not rumoured" path="/news" crumbs={[['News']]} types={['news']} intro="From Nadia Ferreira's labels desk: issue notes, archival arrivals, listening guides and corrections. Announcements are dated and sourced; rumour is not printed." />;
}
export function Columns() {
  return <Section title="Columns" kicker="Recurring · five columnists" path="/columns" crumbs={[['Columns']]} types={['column']} intro="Slow Circuit on duration, Threshold on quiet, Signal Path on machines, The Counter in dissent, Second Pressing on memory. Five standing arguments, updated monthly." />;
}
