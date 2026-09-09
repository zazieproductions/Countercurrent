import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getDB } from '../lib/db';
import { Breadcrumbs, SectionHead } from '../components/Chrome';
import { CompactRow, StandardCard } from '../components/Cards';
import { FromArchive } from '../components/Sidebars';

export function LabelsIndex() {
  const db = getDB();
  const labels = [...db.labels.values()].sort((a, b) => a.name.localeCompare(b.name));
  const counts = new Map<string, number>();
  db.articles.forEach((ar) => ar.labelIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1)));
  return (
    <div>
      <Breadcrumbs trail={[['Labels']]} />
      <h1 className="font-serif font-black text-[36px] md:text-[50px] headline-tight mt-3">Labels</h1>
      <p className="font-serif text-[16px] text-[#3d3a30] mt-2">{labels.length} label files · catalogues, histories, and where the money goes.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 mt-6">
        {labels.map((l) => (
          <Link key={l.id} to={`/labels/${l.id}`} className="group py-3 border-t border-[#191712]/20">
            <span className="font-serif font-black text-[18px] group-hover:text-[#a9321f] group-hover:underline underline-offset-2">{l.name}</span>
            <span className="block font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#6f6a5b] mt-0.5">{l.location} · since {l.founded} · {counts.get(l.id) ?? 0} pieces</span>
            <span className="block font-serif italic text-[13.5px] text-[#3d3a30] mt-1 clamp-2">{l.specialties.join(' · ')}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LabelPage() {
  const { id } = useParams();
  const db = getDB();
  const label = id ? db.labels.get(id) : undefined;
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  useEffect(() => { if (label) document.title = `${label.name} — Countercurrent`; }, [label]);
  if (!label) return <div><h1 className="font-serif font-black text-4xl">No file.</h1><p className="mt-2 font-serif">No label at this address. Try the <Link className="underline" to="/labels">index</Link>.</p></div>;
  const pieces = db.articles.filter((a) => a.labelIds.includes(label.id));
  const releases = [...db.releases.values()].filter((r) => r.labelId === label.id).sort((a, b) => a.year - b.year);
  return (
    <div>
      <Breadcrumbs trail={[['Labels', '/labels'], [label.name]]} />
      <header className="mt-3 grid lg:grid-cols-12 gap-6 border-b-[2.5px] border-[#191712] pb-6">
        <div className="lg:col-span-8">
          <p className="kicker text-[10.5px] text-[#a9321f] mb-1">Label file · founded {label.founded} · {label.status.toLowerCase()}</p>
          <h1 className="font-serif font-black headline-tight text-[40px] md:text-[58px]">{label.name}</h1>
          <p className="font-mono text-[12px] tracking-[0.06em] uppercase text-[#3d3a30] mt-3">{label.location}{label.founder ? ` · founded by ${label.founder}` : ''}</p>
          <p className="font-serif text-[17px] leading-relaxed mt-4 max-w-2xl">{label.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {label.specialties.map((s) => <span key={s} className="font-mono text-[11px] uppercase tracking-[0.06em] border border-[#191712]/30 px-2.5 py-1">{s}</span>)}
          </div>
        </div>
        <aside className="lg:col-span-4">
          <div className="border border-[#191712] bg-[#efe7d3] p-4 lg:sticky lg:top-4">
            <p className="kicker text-[10px] text-[#6f6a5b] mb-1">Catalogue · documented here</p>
            <p className="font-mono text-[24px] font-semibold">{releases.length}<span className="text-[12px] font-normal text-[#6f6a5b]"> releases</span> · {pieces.length}<span className="text-[12px] font-normal text-[#6f6a5b]"> pieces</span></p>
            {releases.map((r) => (
              <Link key={r.id} to={`/releases/${r.id}`} className="group flex items-baseline justify-between gap-2 py-2 border-t border-[#191712]/15 mt-1">
                <span className="font-serif font-bold text-[14.5px] group-hover:text-[#a9321f] group-hover:underline underline-offset-2">{db.artists.get(r.artistId)?.name} — {r.title}</span>
                <span className="font-mono text-[11px] text-[#6f6a5b] shrink-0">{r.year}</span>
              </Link>
            ))}
          </div>
        </aside>
      </header>
      <div className="grid lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-8">
          <SectionHead kicker="Coverage" title={`On ${label.name}`} />
          <div className="grid md:grid-cols-2 gap-x-8">{pieces.slice(0, 12).map((a) => <StandardCard key={a.id} article={a} />)}</div>
        </div>
        <div className="lg:col-span-4"><FromArchive excludeId={pieces[0]?.id} count={3} /></div>
      </div>
    </div>
  );
}

export function GenresIndex() {
  const db = getDB();
  const genres = [...db.genres.values()];
  const counts = new Map<string, number>();
  db.articles.forEach((ar) => ar.genreIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1)));
  return (
    <div>
      <Breadcrumbs trail={[['Desks']]} />
      <h1 className="font-serif font-black text-[36px] md:text-[50px] headline-tight mt-3">Genre Desks</h1>
      <p className="font-serif text-[16px] text-[#3d3a30] mt-2 max-w-3xl">Twenty standing desks, each with a primer, a shelf of reviews, and cross-links to artists, labels and techniques. Start anywhere; every desk connects outward.</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {genres.map((g) => (
          <Link key={g.id} to={`/genres/${g.id}`} className="group border border-[#191712] p-4 hover:bg-[#191712] hover:text-[#f2eee2] transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 shrink-0" style={{ background: g.color }} aria-hidden />
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase opacity-60">{counts.get(g.id) ?? 0} pieces</span>
            </div>
            <span className="font-serif font-black text-[20px] leading-tight group-hover:underline underline-offset-4">{g.name}</span>
            <span className="block font-serif text-[14px] leading-relaxed mt-1.5 opacity-80 clamp-2">{g.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GenrePage() {
  const { id } = useParams();
  const db = getDB();
  const genre = id ? db.genres.get(id) : undefined;
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  useEffect(() => { if (genre) document.title = `${genre.name} — Countercurrent`; }, [genre]);
  if (!genre) return <div><h1 className="font-serif font-black text-4xl">No desk.</h1><p className="mt-2 font-serif">No genre desk at this address. Try <Link className="underline" to="/genres">all desks</Link>.</p></div>;
  const pieces = db.articles.filter((a) => a.genreIds.includes(genre.id));
  const artists = [...db.artists.values()].filter((a) => a.genreIds.includes(genre.id));
  const primer = pieces.find((a) => a.type === 'primer');
  const reviews = pieces.filter((a) => a.type === 'review' || a.type === 'short-review');
  const rest = pieces.filter((a) => a !== primer && !reviews.includes(a));
  return (
    <div>
      <Breadcrumbs trail={[['Desks', '/genres'], [genre.name]]} />
      <header className="mt-3 border-b-[2.5px] border-[#191712] pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-4 h-4" style={{ background: genre.color }} aria-hidden />
          <p className="kicker text-[10.5px] text-[#a9321f]">Genre desk · {pieces.length} pieces · {artists.length} artists</p>
        </div>
        <h1 className="font-serif font-black headline-tight text-[38px] md:text-[56px]">{genre.name}</h1>
        <p className="font-serif text-[17px] leading-relaxed mt-3 max-w-3xl">{genre.description}</p>
        <div className="grid md:grid-cols-3 gap-4 mt-4 max-w-4xl font-mono text-[11.5px] leading-relaxed">
          <div className="border border-[#191712]/30 p-3"><p className="uppercase tracking-[0.14em] text-[#6f6a5b] text-[10px] mb-1">Lineage</p><p>{genre.lineage.join(' · ')}</p></div>
          <div className="border border-[#191712]/30 p-3"><p className="uppercase tracking-[0.14em] text-[#6f6a5b] text-[10px] mb-1">Key figures</p><p>{genre.keyFigures.join(' · ')}</p></div>
          <div className="border border-[#191712]/30 p-3"><p className="uppercase tracking-[0.14em] text-[#6f6a5b] text-[10px] mb-1">Artists filed here</p><p>{artists.slice(0, 6).map((a, i) => (<span key={a.id}>{i > 0 && ' · '}<Link className="underline underline-offset-2 hover:text-[#a9321f]" to={`/artists/${a.id}`}>{a.name}</Link></span>))}{artists.length > 6 && ` +${artists.length - 6} more`}</p></div>
        </div>
      </header>
      {primer && (
        <section aria-label="Desk primer" className="mt-6 border border-[#191712] bg-[#efe7d3] p-5">
          <p className="kicker text-[10px] text-[#a9321f] mb-1">Start here · desk primer</p>
          <Link to={`/articles/${primer.slug}`} className="font-serif font-black text-[24px] leading-tight hover:underline underline-offset-4">{primer.title}</Link>
          <p className="font-serif text-[15.5px] text-[#3d3a30] mt-2 max-w-3xl">{primer.dek}</p>
        </section>
      )}
      <div className="grid lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-8">
          <SectionHead kicker="Reviews" title="On the desk" />
          <div className="grid md:grid-cols-2 gap-x-8">{reviews.slice(0, 12).map((a) => <StandardCard key={a.id} article={a} />)}</div>
          {rest.length > 0 && (<><div className="mt-6"><SectionHead kicker="Features & columns" title="Further" /></div><div>{rest.slice(0, 8).map((a) => <CompactRow key={a.id} article={a} />)}</div></>)}
        </div>
        <div className="lg:col-span-4 space-y-6">
          <nav aria-label="All artists on this desk">
            <p className="kicker text-[10px] text-[#6f6a5b] mb-2">Artists on this desk</p>
            <div className="flex flex-wrap gap-1.5">{artists.map((a) => <Link key={a.id} to={`/artists/${a.id}`} className="font-mono text-[11px] border border-[#191712]/30 px-2 py-1 hover:bg-[#191712] hover:text-[#f2eee2]">{a.name}</Link>)}</div>
          </nav>
          <FromArchive excludeId={primer?.id} count={3} />
        </div>
      </div>
    </div>
  );
}

export function WritersIndex() {
  const db = getDB();
  const counts = new Map<string, number>();
  db.articles.forEach((ar) => counts.set(ar.writerId, (counts.get(ar.writerId) ?? 0) + 1));
  return (
    <div>
      <Breadcrumbs trail={[['Writers']]} />
      <h1 className="font-serif font-black text-[36px] md:text-[50px] headline-tight mt-3">Writers</h1>
      <p className="font-serif text-[16px] text-[#3d3a30] mt-2 max-w-3xl">Fourteen critics with distinct beats and stated positions. Every review is signed; every position is on the record.</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {[...db.writers.values()].map((w) => (
          <Link key={w.id} to={`/writers/${w.id}`} className="group border border-[#191712] p-4 flex gap-4 hover:bg-[#efe7d3]">
            <span className="shrink-0 w-12 h-12 bg-[#191712] text-[#f2eee2] font-mono text-[15px] flex items-center justify-center group-hover:bg-[#a9321f]" aria-hidden>{w.initials}</span>
            <span>
              <span className="font-serif font-black text-[19px] group-hover:underline underline-offset-2">{w.name}</span>
              <span className="block font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#6f6a5b] mt-0.5">{w.role} · {counts.get(w.id) ?? 0} pieces</span>
              <span className="block font-serif italic text-[14px] text-[#3d3a30] mt-1">{w.beat}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function WriterPage() {
  const { id } = useParams();
  const db = getDB();
  const writer = id ? db.writers.get(id) : undefined;
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  useEffect(() => { if (writer) document.title = `${writer.name} — Countercurrent`; }, [writer]);
  if (!writer) return <div><h1 className="font-serif font-black text-4xl">No byline.</h1><p className="mt-2 font-serif">No writer at this address. Try <Link className="underline" to="/writers">all writers</Link>.</p></div>;
  const pieces = db.articles.filter((a) => a.writerId === writer.id);
  const desks = [...new Set(pieces.flatMap((a) => a.genreIds))].map((g) => db.genres.get(g)).filter(Boolean);
  return (
    <div>
      <Breadcrumbs trail={[['Writers', '/writers'], [writer.name]]} />
      <header className="mt-3 grid lg:grid-cols-12 gap-6 border-b-[2.5px] border-[#191712] pb-6">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-4">
            <span className="w-16 h-16 bg-[#191712] text-[#f2eee2] font-mono text-[20px] flex items-center justify-center shrink-0" aria-hidden>{writer.initials}</span>
            <div>
              <p className="kicker text-[10.5px] text-[#a9321f]">{writer.role} · on the masthead since {writer.since}</p>
              <h1 className="font-serif font-black text-[36px] md:text-[50px] leading-none">{writer.name}</h1>
            </div>
          </div>
          <p className="font-mono text-[12px] tracking-[0.06em] uppercase text-[#3d3a30] mt-4">{writer.location} · {writer.beat}</p>
          <p className="font-serif text-[17px] leading-relaxed mt-3 max-w-2xl">{writer.bio}</p>
          <p className="font-mono text-[11.5px] leading-relaxed border-l-2 border-[#a9321f] pl-3 mt-4 max-w-2xl"><span className="uppercase tracking-[0.12em] text-[#a9321f]">Critical position: </span>{writer.stance}</p>
        </div>
        <aside className="lg:col-span-4">
          <div className="border border-[#191712] bg-[#efe7d3] p-4 lg:sticky lg:top-4">
            <p className="kicker text-[10px] text-[#6f6a5b] mb-1">File</p>
            <p className="font-mono text-[24px] font-semibold">{pieces.length}<span className="text-[12px] font-normal text-[#6f6a5b]"> pieces</span></p>
            <p className="kicker text-[10px] text-[#6f6a5b] mt-3 mb-1">Desks covered</p>
            <div className="flex flex-wrap gap-1.5">{desks.slice(0, 8).map((g) => <Link key={g!.id} to={`/genres/${g!.id}`} className="font-mono text-[10.5px] uppercase border border-[#191712]/30 px-2 py-1 hover:bg-[#191712] hover:text-[#f2eee2]">{g!.short}</Link>)}</div>
          </div>
        </aside>
      </header>
      <div className="grid lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-8">
          <SectionHead kicker="Byline" title={`By ${writer.name.split(' ')[0]}`} />
          <div className="grid md:grid-cols-2 gap-x-8">{pieces.slice(0, 14).map((a) => <StandardCard key={a.id} article={a} />)}</div>
        </div>
        <div className="lg:col-span-4"><FromArchive excludeId={pieces[0]?.id} count={3} /></div>
      </div>
    </div>
  );
}
