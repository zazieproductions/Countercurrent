import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { getDB, relatedArticles } from '../lib/db';
import { formatDate, ratingWord } from '../lib/format';
import { TYPE_LABELS, SECTION_FOR_TYPE } from '../lib/types';
import { Breadcrumbs, Byline, RatingStamp, TagRow } from '../components/Chrome';
import { ArticleSidebar } from '../components/Sidebars';
import { CompactRow } from '../components/Cards';

export default function ArticlePage() {
  const { slug } = useParams();
  const db = getDB();
  const article = slug ? db.articlesBySlug.get(slug) : undefined;
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => {
    if (article) document.title = `${article.title} — Countercurrent`;
  }, [article]);
  if (!article) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-serif font-black text-4xl">Not in the archive.</h1>
        <p className="font-serif mt-3 text-lg">No article at this address. The index may have moved it — try <Link className="underline" to="/search">search</Link> or the <Link className="underline" to="/archive">full archive</Link>.</p>
      </div>
    );
  }
  const writer = db.writers.get(article.writerId);
  const section = SECTION_FOR_TYPE[article.type];
  const sectionPath = section === 'Reviews' ? '/reviews' : section === 'Features' ? '/features' : section === 'Essays' ? '/essays' : section === 'News' ? '/news' : '/columns';
  const rel = relatedArticles(article, db.articles, 6);
  const firstGenre = article.genreIds[0] ? db.genres.get(article.genreIds[0]) : undefined;
  return (
    <article>
      <Breadcrumbs trail={[[section, sectionPath], [TYPE_LABELS[article.type]], [article.title.slice(0, 48) + (article.title.length > 48 ? '…' : undefined)]]} />
      <header className="mt-4 grid lg:grid-cols-12 gap-6 border-b-[2.5px] border-[#191712] pb-6">
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-block font-mono text-[10px] tracking-[0.16em] uppercase bg-[#191712] text-[#f2eee2] px-2 py-[3px]">{TYPE_LABELS[article.type]}</span>
            <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[#a9321f]">{article.catalogNo} · Issue CC-{article.issueNo}</span>
            {article.archival && <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase border border-[#a9321f] text-[#a9321f] px-2 py-[2px]">From the archive</span>}
          </div>
          <h1 className="font-serif font-black headline-tight text-[34px] md:text-[50px]">{article.title}</h1>
          <p className="font-serif text-[18px] md:text-[20px] leading-relaxed text-[#3d3a30] mt-4 max-w-2xl">{article.dek}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Byline article={article} />
            {article.rating !== undefined && <RatingStamp rating={article.rating} size="sm" />}
          </div>
          {writer && (
            <p className="font-mono text-[11px] text-[#6f6a5b] mt-3 leading-relaxed max-w-2xl"><Link to={`/writers/${writer.id}`} className="underline underline-offset-2 text-[#3d3a30] hover:text-[#a9321f]">{writer.name}</Link> · {writer.role.toLowerCase()} · {writer.beat.toLowerCase()}. {writer.stance}</p>
          )}
        </div>
        <div className="lg:col-span-4">
          <div className="border border-[#191712] bg-[#efe7d3] p-4 lg:sticky lg:top-4">
            <p className="kicker text-[10px] text-[#6f6a5b] mb-2">This piece · at a glance</p>
            <dl className="font-mono text-[11.5px] leading-relaxed space-y-1.5">
              <div className="grid grid-cols-[72px_1fr] gap-2"><dt className="uppercase tracking-[0.12em] text-[#6f6a5b] text-[10px] pt-[2px]">Filed</dt><dd>{article.genreIds.map((g, i) => (<span key={g}>{i > 0 && '; '}<Link className="underline underline-offset-2 hover:text-[#a9321f]" to={`/genres/${g}`}>{db.genres.get(g)?.name ?? g}</Link></span>))}</dd></div>
              <div className="grid grid-cols-[72px_1fr] gap-2"><dt className="uppercase tracking-[0.12em] text-[#6f6a5b] text-[10px] pt-[2px]">Artists</dt><dd>{article.artistIds.map((id, i) => (<span key={id}>{i > 0 && '; '}<Link className="underline underline-offset-2 hover:text-[#a9321f]" to={`/artists/${id}`}>{db.artists.get(id)?.name ?? id}</Link></span>))}</dd></div>
              {article.releaseIds[0] && db.releases.get(article.releaseIds[0]) && <div className="grid grid-cols-[72px_1fr] gap-2"><dt className="uppercase tracking-[0.12em] text-[#6f6a5b] text-[10px] pt-[2px]">Release</dt><dd><Link className="underline underline-offset-2 hover:text-[#a9321f]" to={`/releases/${db.releases.get(article.releaseIds[0])!.id}`}>{db.releases.get(article.releaseIds[0])!.title}</Link></dd></div>}
              <div className="grid grid-cols-[72px_1fr] gap-2"><dt className="uppercase tracking-[0.12em] text-[#6f6a5b] text-[10px] pt-[2px]">Published</dt><dd>{formatDate(article.publishedAt)} · {article.readingMinutes} min read</dd></div>
            </dl>
            {article.rating !== undefined && <div className="mt-3 pt-3 border-t border-[#191712]/20"><RatingStamp rating={article.rating} size="md" /><p className="font-mono text-[10.5px] text-[#6f6a5b] mt-1">Scores run 0–10. {ratingWord(article.rating)}: see <Link className="underline" to="/about#ratings">how we rate</Link>.</p></div>}
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mt-7">
        <div className="lg:col-span-8">
          {article.pullQuote && <blockquote className="border-l-[3px] border-[#a9321f] pl-4 font-serif italic text-[20px] leading-snug mb-6">“{article.pullQuote}”</blockquote>}
          <div className="article-body font-serif text-[17.5px] leading-[1.72] text-[#191712] max-w-[68ch]" itemProp="articleBody">
            {article.body.map((p, i) => <p key={i} className={i === 0 ? 'dropcap' : undefined}>{p}</p>)}
          </div>
          <p className="font-mono text-[11px] leading-relaxed text-[#6f6a5b] border-t border-[#191712]/25 mt-8 pt-4 max-w-[68ch]">
            <span className="uppercase tracking-[0.12em] text-[#a9321f]">A note on method.</span> Release metadata above (dates, labels, formats, personnel) is factual and checked against sleeves and primary sources. The reading of the music is {writer?.name ?? 'the writer'}'s signed critical opinion — Countercurrent commentary, not artist statement. We publish no invented quotations or interviews. Spot an error? <Link className="underline" to="/about">Write to the desk</Link> — corrections are printed.
          </p>
          <div className="mt-5 max-w-[68ch]"><TagRow tags={article.tags} /></div>
          {writer && (
            <div className="mt-6 border border-[#191712] p-4 flex gap-4 items-start max-w-[68ch]">
              <Link to={`/writers/${writer.id}`} className="shrink-0 w-12 h-12 bg-[#191712] text-[#f2eee2] font-mono text-[15px] flex items-center justify-center" aria-hidden>{writer.initials}</Link>
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6f6a5b]">Written by</p>
                <p className="font-serif font-bold text-[17px]"><Link to={`/writers/${writer.id}`} className="hover:text-[#a9321f] hover:underline underline-offset-2">{writer.name}</Link></p>
                <p className="font-serif text-[14px] text-[#3d3a30] leading-relaxed mt-1 clamp-2">{writer.bio}</p>
              </div>
            </div>
          )}
          <nav aria-label="More in this area" className="mt-8 max-w-[68ch]">
            <p className="kicker text-[10px] text-[#a9321f] mb-2">Keep going · the rabbit hole, signposted</p>
            <div className="flex flex-wrap gap-1.5">
              {article.artistIds.slice(0, 3).map((id) => <Link key={id} to={`/artists/${id}`} className="font-mono text-[11px] uppercase tracking-[0.06em] border border-[#191712] px-2.5 py-1.5 hover:bg-[#191712] hover:text-[#f2eee2]">More {db.artists.get(id)?.name} →</Link>)}
              {firstGenre && <Link to={`/genres/${firstGenre.id}`} className="font-mono text-[11px] uppercase tracking-[0.06em] border border-[#a9321f] text-[#a9321f] px-2.5 py-1.5 hover:bg-[#a9321f] hover:text-[#f2eee2]">More {firstGenre.short} →</Link>}
              <Link to="/archive" className="font-mono text-[11px] uppercase tracking-[0.06em] border border-[#191712]/40 px-2.5 py-1.5 hover:bg-[#191712] hover:text-[#f2eee2]">Full archive →</Link>
            </div>
          </nav>
        </div>
        <aside className="lg:col-span-4"><div className="lg:sticky lg:top-4"><ArticleSidebar article={article} /></div></aside>
      </div>

      <section aria-label="Related reading" className="mt-10 border-t-[2.5px] border-[#191712] pt-5">
        <h2 className="font-serif font-black text-[24px] mb-1">Related reading</h2>
        <p className="font-serif italic text-[15px] text-[#6f6a5b] mb-4">Chosen by shared artists, releases, desks, labels and tags — not by vibes.</p>
        <div className="grid md:grid-cols-2 gap-x-8">
          {rel.map(({ article: a, reasons }) => (
            <div key={a.id} className="py-2 border-t border-[#191712]/15">
              <CompactRow article={a} />
              <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-[#6f6a5b]">↳ {reasons.join(' · ')}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
