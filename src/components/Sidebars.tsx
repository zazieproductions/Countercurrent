import { Link } from 'react-router-dom';
import { getDB, relatedArticles } from '../lib/db';
import type { Article } from '../lib/types';
import { CompactRow, MetaList } from './Cards';
import { TagRow } from './Chrome';

export function RelatedReading({ article, limit = 5 }: { article: Article; limit?: number }) {
  const db = getDB();
  const rel = relatedArticles(article, db.articles, limit);
  if (!rel.length) return null;
  return (
    <aside aria-label="Related reading" className="border border-[#191712] bg-[#efe7d3]">
      <p className="kicker text-[10px] px-4 pt-3 text-[#a9321f]">Related reading · why these</p>
      <div className="px-4 py-3">
        {rel.map(({ article: a, reasons }) => (
          <div key={a.id} className="py-2 border-t border-[#191712]/15 first:border-t-0 first:pt-0">
            <CompactRow article={a} />
            <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-[#6f6a5b] mt-0.5">↳ {reasons.join(' · ')}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function FromArchive({ excludeId, count = 4 }: { excludeId?: string; count?: number }) {
  const db = getDB();
  // deterministic "random" archival picks: older pieces, stable per day
  const day = Math.floor(Date.now() / 86400000);
  const pool = db.articles.filter((a) => a.id !== excludeId && (a.archival || Number(a.publishedAt.slice(0, 4)) < 2020));
  const picks = [...pool].sort((a, b) => {
    const ha = hash(a.id + day) % 997;
    const hb = hash(b.id + day) % 997;
    return ha - hb;
  }).slice(0, count);
  return (
    <aside aria-label="From the archive" className="border-t-[2.5px] border-[#191712] pt-3">
      <p className="kicker text-[10px] text-[#a9321f] mb-1">From the archive · changes daily</p>
      <p className="font-serif italic text-[15px] text-[#3d3a30] mb-3">Deeper in the stacks — pieces the index keeps returning to.</p>
      <div>{picks.map((a) => <CompactRow key={a.id} article={a} />)}</div>
      <Link to="/archive" className="inline-block mt-2 font-mono text-[11px] tracking-[0.12em] uppercase underline underline-offset-2 hover:text-[#a9321f]">Open the full archive →</Link>
    </aside>
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function ArticleSidebar({ article }: { article: Article }) {
  const db = getDB();
  return (
    <div className="space-y-6">
      <div className="border border-[#191712] bg-[#efe7d3] p-4">
        <p className="kicker text-[10px] text-[#6f6a5b] mb-2">Filed under</p>
        <MetaList article={article} />
      </div>
      {article.factBox && (
        <div className="border border-dashed border-[#191712]/50 p-4">
          <p className="kicker text-[10px] text-[#a9321f] mb-2">Fact box · verified</p>
          <ul className="font-mono text-[11.5px] leading-relaxed space-y-1.5 text-[#3d3a30]">
            {article.factBox.map((f, i) => <li key={i} className="flex gap-2"><span aria-hidden className="text-[#a9321f]">▪</span><span>{f}</span></li>)}
          </ul>
        </div>
      )}
      {article.listenTo && (
        <div className="border border-[#191712]/40 p-4">
          <p className="kicker text-[10px] text-[#6f6a5b] mb-2">If this, then these</p>
          <ul className="font-serif text-[14.5px] leading-snug space-y-1.5">
            {article.listenTo.map((t) => <li key={t} className="flex gap-2"><span aria-hidden>→</span><span>{t}</span></li>)}
          </ul>
        </div>
      )}
      <div>
        <p className="kicker text-[10px] text-[#6f6a5b] mb-2">Tags</p>
        <TagRow tags={article.tags} />
      </div>
      <RelatedReading article={article} limit={4} />
    </div>
  );
}
