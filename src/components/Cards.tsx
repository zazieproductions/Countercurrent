import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Article } from '../lib/types';
import { formatDate } from '../lib/format';
import { getDB } from '../lib/db';
import { Byline, RatingStamp, TypeTag } from './Chrome';

export function LeadCard({ article }: { article: Article }) {
  return (
    <article className="grid md:grid-cols-12 gap-5 md:gap-8 py-2">
      <div className="md:col-span-8">
        <div className="flex items-center gap-2 mb-3">
          <TypeTag type={article.type} />
          <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-[#a9321f]">Lead review · {article.catalogNo}</span>
        </div>
        <Link to={`/articles/${article.slug}`}>
          <h2 className="font-serif font-black headline-tight text-[32px] md:text-[52px] hover:text-[#a9321f] transition-colors">{article.title}</h2>
        </Link>
        <p className="font-serif text-[17px] md:text-[19px] leading-relaxed text-[#3d3a30] mt-3 max-w-2xl">{article.dek}</p>
        <div className="mt-4"><Byline article={article} /></div>
        {article.pullQuote && (
          <blockquote className="mt-5 border-l-[3px] border-[#a9321f] pl-4 font-serif italic text-[18px] leading-snug text-[#191712] max-w-xl">“{article.pullQuote}”</blockquote>
        )}
      </div>
      <div className="md:col-span-4">
        <div className="border border-[#191712] bg-[#efe7d3] p-4 md:sticky md:top-4">
          <p className="kicker text-[10px] text-[#6f6a5b] mb-2">Marginal metadata</p>
          <MetaList article={article} />
          {article.rating !== undefined && <div className="mt-4 pt-4 border-t border-[#191712]/20"><RatingStamp rating={article.rating} size="lg" /></div>}
          <Link to={`/articles/${article.slug}`} className="mt-4 block text-center font-mono text-[11px] tracking-[0.14em] uppercase bg-[#191712] text-[#f2eee2] py-2.5 hover:bg-[#a9321f] transition-colors">Read in full</Link>
        </div>
      </div>
    </article>
  );
}

export function MetaList({ article }: { article: Article }) {
  const db = getDB();
  const rows: [string, ReactNode][] = [];
  if (article.artistIds.length) rows.push(['Artist', <>{article.artistIds.map((id, i) => (<span key={id}>{i > 0 && '; '}<Link className="underline underline-offset-2 hover:text-[#a9321f]" to={`/artists/${id}`}>{db.artists.get(id)?.name ?? id}</Link></span>))}</>]);
  if (article.releaseIds.length) {
    const r = db.releases.get(article.releaseIds[0]);
    if (r) rows.push(['Release', <><Link className="underline underline-offset-2 hover:text-[#a9321f]" to={`/releases/${r.id}`}>{r.title}</Link> ({r.year})</>]);
  }
  if (article.labelIds.length) rows.push(['Label', <>{article.labelIds.slice(0, 2).map((id, i) => (<span key={id}>{i > 0 && '; '}<Link className="underline underline-offset-2 hover:text-[#a9321f]" to={`/labels/${id}`}>{db.labels.get(id)?.name ?? id}</Link></span>))}</>]);
  rows.push(['Filed', <>{article.genreIds.slice(0, 2).map((id, i) => (<span key={id}>{i > 0 && '; '}<Link className="underline underline-offset-2 hover:text-[#a9321f]" to={`/genres/${id}`}>{db.genres.get(id)?.short ?? id}</Link></span>))}</>]);
  rows.push(['Issue', <span>{article.catalogNo} · {formatDate(article.publishedAt)}</span>]);
  return (
    <dl className="font-mono text-[11.5px] leading-relaxed space-y-1.5">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[64px_1fr] gap-2">
          <dt className="uppercase tracking-[0.12em] text-[#6f6a5b] text-[10px] pt-[2px]">{k}</dt>
          <dd className="text-[#191712]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function StandardCard({ article, showDek = true }: { article: Article; showDek?: boolean }) {
  const db = getDB();
  const w = db.writers.get(article.writerId);
  return (
    <article className="group border-t border-[#191712]/25 py-4 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <TypeTag type={article.type} />
        {article.rating !== undefined && <span className="font-mono text-[11px] font-semibold text-[#a9321f]">{article.rating.toFixed(1)}</span>}
        <span className="font-mono text-[10.5px] tracking-[0.08em] uppercase text-[#6f6a5b]">{article.catalogNo}</span>
      </div>
      <Link to={`/articles/${article.slug}`}>
        <h3 className="font-serif font-bold text-[20px] md:text-[22px] leading-[1.12] tracking-tight group-hover:text-[#a9321f] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 transition-colors">{article.title}</h3>
      </Link>
      {showDek && <p className="font-serif text-[15px] leading-relaxed text-[#3d3a30] mt-1.5 clamp-2">{article.dek}</p>}
      <p className="font-mono text-[10.5px] tracking-[0.06em] uppercase text-[#6f6a5b] mt-2">{w?.name} · {formatDate(article.publishedAt)} · {article.readingMinutes} min</p>
    </article>
  );
}

export function CompactRow({ article }: { article: Article }) {
  const db = getDB();
  const w = db.writers.get(article.writerId);
  return (
    <article className="group flex gap-3 py-2.5 border-t border-[#191712]/20 first:border-t-0 first:pt-0">
      {article.rating !== undefined && <span className="shrink-0 font-mono text-[12px] font-semibold text-[#a9321f] border border-[#a9321f] w-11 h-7 flex items-center justify-center mt-[1px]">{article.rating.toFixed(1)}</span>}
      <div className="min-w-0">
        <Link to={`/articles/${article.slug}`} className="font-serif font-bold text-[15.5px] leading-snug group-hover:text-[#a9321f] group-hover:underline underline-offset-2 transition-colors">{article.title}</Link>
        <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-[#6f6a5b] mt-0.5 truncate">{w?.name} · {formatDate(article.publishedAt)} · {article.catalogNo}</p>
      </div>
    </article>
  );
}

export function IndexRow({ article, n }: { article: Article; n?: number }) {
  const db = getDB();
  const w = db.writers.get(article.writerId);
  return (
    <article className="group grid grid-cols-[44px_1fr] md:grid-cols-[56px_130px_1fr_auto] gap-3 items-baseline py-2.5 border-t border-[#191712]/20 first:border-t-0">
      <span className="font-mono text-[11px] text-[#6f6a5b]">{n !== undefined ? String(n).padStart(3, '0') : article.catalogNo}</span>
      <span className="hidden md:block font-mono text-[11px] text-[#6f6a5b]">{formatDate(article.publishedAt)}</span>
      <div className="min-w-0">
        <Link to={`/articles/${article.slug}`} className="font-serif font-bold text-[16px] leading-snug group-hover:text-[#a9321f] group-hover:underline underline-offset-2">{article.title}</Link>
        <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-[#6f6a5b] mt-0.5">{w?.name} · {article.type}</p>
      </div>
      {article.rating !== undefined && <span className="font-mono text-[12px] font-semibold text-[#a9321f]">{article.rating.toFixed(1)}</span>}
    </article>
  );
}
