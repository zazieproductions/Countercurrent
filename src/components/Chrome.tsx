import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Article } from '../lib/types';
import { TYPE_LABELS } from '../lib/types';
import { formatDate, ratingWord } from '../lib/format';
import { getDB } from '../lib/db';

export function Breadcrumbs({ trail }: { trail: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#6f6a5b]">
      <ol className="flex flex-wrap items-center gap-1">
        <li><Link to="/" className="hover:text-[#a9321f] hover:underline">Front</Link></li>
        {trail.map(([label, to], i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight size={11} aria-hidden />
            {to ? <Link to={to} className="hover:text-[#a9321f] hover:underline">{label}</Link> : <span aria-current="page" className="text-[#191712]">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Byline({ article, showDate = true }: { article: Article; showDate?: boolean }) {
  const db = getDB();
  const w = db.writers.get(article.writerId);
  return (
    <p className="font-mono text-[11.5px] tracking-[0.06em] uppercase text-[#3d3a30]">
      By {w ? <Link to={`/writers/${w.id}`} className="underline decoration-[#a9321f] underline-offset-2 hover:text-[#a9321f]">{w.name}</Link> : article.writerId}
      {showDate && <span className="text-[#6f6a5b]"> · {formatDate(article.publishedAt)} · {article.readingMinutes} min · {article.catalogNo}</span>}
    </p>
  );
}

export function RatingStamp({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'w-20 h-20 text-[26px]' : size === 'sm' ? 'w-11 h-11 text-[15px]' : 'w-14 h-14 text-[19px]';
  return (
    <div className="flex items-center gap-2" title={`${rating.toFixed(1)} — ${ratingWord(rating)}`}>
      <div className={`${cls} shrink-0 rounded-full border-2 border-[#a9321f] text-[#a9321f] flex flex-col items-center justify-center leading-none`} style={{ fontWeight: 800 }}>
        <span>{rating.toFixed(1)}</span>
      </div>
      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#a9321f]">{ratingWord(rating)}</span>
    </div>
  );
}

export function TypeTag({ type }: { type: Article['type'] }) {
  return (
    <span className="inline-block font-mono text-[10px] tracking-[0.16em] uppercase bg-[#191712] text-[#f2eee2] px-2 py-[3px]">{TYPE_LABELS[type]}</span>
  );
}

export function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Tags">
      {tags.map((t) => (
        <Link key={t} to={`/search?tag=${encodeURIComponent(t)}`} className="font-mono text-[10.5px] tracking-[0.06em] uppercase border border-[#191712]/30 px-2 py-[2px] hover:bg-[#191712] hover:text-[#f2eee2] transition-colors">#{t}</Link>
      ))}
    </div>
  );
}

export function SectionHead({ kicker, title, more, moreTo }: { kicker: string; title: string; more?: string; moreTo?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b-[2.5px] border-[#191712] pb-2 mb-5">
      <div>
        <p className="kicker text-[10.5px] text-[#a9321f] mb-1">{kicker}</p>
        <h2 className="font-serif font-black text-[24px] md:text-[30px] leading-none tracking-tight">{title}</h2>
      </div>
      {more && moreTo && <Link to={moreTo} className="shrink-0 font-mono text-[11px] tracking-[0.12em] uppercase border border-[#191712] px-3 py-1.5 hover:bg-[#191712] hover:text-[#f2eee2] transition-colors">{more}</Link>}
    </div>
  );
}

export function MarginalNote({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[11px] leading-relaxed text-[#6f6a5b] border-l-2 border-[#a9321f] pl-3 my-4">{children}</p>;
}
