import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getDB } from '../lib/db';
import { Breadcrumbs } from '../components/Chrome';
import { IndexRow } from '../components/Cards';
import { TYPE_LABELS, type Article } from '../lib/types';

export function SearchPage() {
  const db = getDB();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const tag = params.get('tag') ?? '';
  const [input, setInput] = useState(q || tag);
  const results = useMemo(() => searchArticles(q, tag, db.articles, db), [q, tag, db]);
  return (
    <div>
      <Breadcrumbs trail={[['Search']]} />
      <h1 className="font-serif font-black text-[36px] md:text-[50px] headline-tight mt-3">Search the archive</h1>
      <p className="font-serif text-[16px] text-[#3d3a30] mt-2">{db.articles.length} articles · {db.artists.size} artists · {db.releases.size} releases · {db.labels.size} labels · every tag cross-linked.</p>
      <form className="mt-4 flex gap-2 max-w-2xl" role="search" onSubmit={(e) => { e.preventDefault(); setParams(input ? { q: input } : {}); }}>
        <label htmlFor="q" className="sr-only">Search</label>
        <input id="q" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Try \u201cno-input mixer\u201d, \u201cOnkyo\u201d, \u201cjust intonation\u201d, \u201cBasic Channel\u201d…" className="flex-1 bg-transparent border border-[#191712] px-3 py-2.5 font-serif text-[16px] placeholder:text-[#6f6a5b] placeholder:italic focus:outline-none focus:border-[#a9321f]" />
        <button className="bg-[#191712] text-[#f2eee2] px-5 font-mono text-[11px] tracking-[0.14em] uppercase hover:bg-[#a9321f] flex items-center gap-2"><Search size={14} /> Search</button>
      </form>
      {tag && <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.08em]">Tag: <span className="bg-[#191712] text-[#f2eee2] px-2 py-1">#{tag}</span> <button className="underline ml-2" onClick={() => { setParams({}); setInput(''); }}>clear</button></p>}
      {(q || tag) && <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#6f6a5b] mt-4">{results.length} result{results.length === 1 ? '' : 's'}{q && <> for “{q}”</>}</p>}
      <div className="mt-2 max-w-4xl">
        {results.slice(0, 60).map((a, i) => <IndexRow key={a.id} article={a} n={i + 1} />)}
        {(q || tag) && !results.length && <p className="font-serif text-lg mt-4">Nothing filed under that. Try a genre desk, an artist name, or browse the <Link className="underline" to="/archive">chronological archive</Link>.</p>}
        {!q && !tag && (
          <div className="mt-6">
            <p className="kicker text-[10px] text-[#6f6a5b] mb-2">Popular tags — every one a rabbit hole</p>
            <div className="flex flex-wrap gap-1.5">{popularTags(db.articles).map(([t, n]) => <Link key={t} to={`/search?tag=${encodeURIComponent(t)}`} className="font-mono text-[11px] uppercase tracking-[0.06em] border border-[#191712]/30 px-2.5 py-1 hover:bg-[#191712] hover:text-[#f2eee2]">#{t} <span className="opacity-60">{n}</span></Link>)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function popularTags(articles: Article[]): [string, number][] {
  const m = new Map<string, number>();
  articles.forEach((a) => a.tags.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)));
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40);
}

function searchArticles(q: string, tag: string, articles: Article[], db: ReturnType<typeof getDB>): Article[] {
  let pool = articles;
  if (tag) pool = pool.filter((a) => a.tags.includes(tag));
  if (!q.trim()) return pool;
  const needle = q.trim().toLowerCase();
  const terms = needle.split(/\s+/);
  const scored: [Article, number][] = [];
  for (const a of pool) {
    const writer = db.writers.get(a.writerId)?.name ?? '';
    const artistNames = a.artistIds.map((id) => db.artists.get(id)?.name ?? '').join(' ');
    const releaseTitles = a.releaseIds.map((id) => db.releases.get(id)?.title ?? '').join(' ');
    const genreNames = a.genreIds.map((id) => db.genres.get(id)?.name ?? '').join(' ');
    const hay = `${a.title} ${a.dek} ${a.body.join(' ')} ${a.tags.join(' ')} ${writer} ${artistNames} ${releaseTitles} ${genreNames}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (a.title.toLowerCase().includes(t)) score += 10;
      else if (artistNames.toLowerCase().includes(t)) score += 8;
      else if (releaseTitles.toLowerCase().includes(t)) score += 7;
      else if (a.tags.join(' ').toLowerCase().includes(t)) score += 5;
      else if (hay.includes(t)) score += 2;
      else { score = -1; break; }
    }
    if (score >= 0) scored.push([a, score]);
  }
  return scored.sort((x, y) => y[1] - x[1] || (x[0].publishedAt < y[0].publishedAt ? 1 : -1)).map(([a]) => a);
}

export function ArchivePage() {
  const db = getDB();
  const [year, setYear] = useState<string>('all');
  const [type, setType] = useState<string>('all');
  const years = useMemo(() => {
    const m = new Map<string, number>();
    db.articles.forEach((a) => { const y = a.publishedAt.slice(0, 4); m.set(y, (m.get(y) ?? 0) + 1); });
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [db]);
  const types = useMemo(() => [...new Set(db.articles.map((a) => a.type))], [db]);
  const list = useMemo(() => db.articles.filter((a) => (year === 'all' || a.publishedAt.startsWith(year)) && (type === 'all' || a.type === type)), [db, year, type]);
  const groups = useMemo(() => {
    const g = new Map<string, Article[]>();
    list.forEach((a) => { const y = a.publishedAt.slice(0, 4); if (!g.has(y)) g.set(y, []); g.get(y)!.push(a); });
    return [...g.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [list]);
  let n = 0;
  return (
    <div>
      <Breadcrumbs trail={[['Archive']]} />
      <h1 className="font-serif font-black text-[36px] md:text-[50px] headline-tight mt-3">The Archive</h1>
      <p className="font-serif text-[16px] text-[#3d3a30] mt-2 max-w-3xl">Every piece since CC-001, chronological. Filter by year and form — each entry links to its artists, releases, labels, writers and desks.</p>
      <div className="flex flex-wrap gap-2 mt-4 no-print items-center">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#6f6a5b]">Year:</span>
        <button onClick={() => setYear('all')} className={`font-mono text-[11px] border px-2 py-1 ${year === 'all' ? 'bg-[#191712] text-[#f2eee2]' : 'border-[#191712]/30'}`}>All ({db.articles.length})</button>
        {years.map(([y, c]) => <button key={y} onClick={() => setYear(y)} className={`font-mono text-[11px] border px-2 py-1 ${year === y ? 'bg-[#191712] text-[#f2eee2]' : 'border-[#191712]/30'}`}>{y} <span className="opacity-60">{c}</span></button>)}
      </div>
      <div className="flex flex-wrap gap-2 mt-2 no-print items-center">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#6f6a5b]">Form:</span>
        <button onClick={() => setType('all')} className={`font-mono text-[11px] border px-2 py-1 ${type === 'all' ? 'bg-[#a9321f] text-[#f2eee2] border-[#a9321f]' : 'border-[#191712]/30'}`}>All</button>
        {types.map((t) => <button key={t} onClick={() => setType(t)} className={`font-mono text-[11px] border px-2 py-1 ${type === t ? 'bg-[#a9321f] text-[#f2eee2] border-[#a9321f]' : 'border-[#191712]/30'}`}>{TYPE_LABELS[t]}</button>)}
      </div>
      <div className="mt-6 max-w-5xl">
        {groups.map(([y, items]) => (
          <section key={y} aria-label={`Articles from ${y}`} className="mb-8">
            <div className="flex items-baseline gap-3 border-b-[2.5px] border-[#191712] pb-1 mb-1">
              <h2 className="font-serif font-black text-[26px]">{y}</h2>
              <span className="font-mono text-[11px] text-[#6f6a5b] uppercase tracking-[0.1em]">{items.length} pieces</span>
            </div>
            {items.map((a) => { n += 1; return <IndexRow key={a.id} article={a} n={n} />; })}
          </section>
        ))}
      </div>
    </div>
  );
}
