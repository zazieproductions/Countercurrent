import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getDB } from '../lib/db';
import { Breadcrumbs, SectionHead } from '../components/Chrome';
import { CompactRow, StandardCard } from '../components/Cards';
import { FromArchive } from '../components/Sidebars';

export function ArtistsIndex() {
  const db = getDB();
  const artists = [...db.artists.values()].sort((a, b) => a.name.localeCompare(b.name));
  const counts = new Map<string, number>();
  db.articles.forEach((ar) => ar.artistIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1)));
  return (
    <div>
      <Breadcrumbs trail={[['Artists']]} />
      <h1 className="font-serif font-black text-[36px] md:text-[50px] headline-tight mt-3">Artists</h1>
      <p className="font-serif text-[16px] text-[#3d3a30] mt-2">{artists.length} artist files · every file links reviews, releases, labels, desks and related reading.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1 mt-6">
        {artists.map((a) => (
          <Link key={a.id} to={`/artists/${a.id}`} className="group flex items-baseline justify-between gap-3 py-2 border-t border-[#191712]/20">
            <span className="font-serif font-bold text-[16px] group-hover:text-[#a9321f] group-hover:underline underline-offset-2">{a.name}</span>
            <span className="font-mono text-[10.5px] text-[#6f6a5b] uppercase tracking-[0.06em] shrink-0">{counts.get(a.id) ?? 0} pieces · {a.origin.split(',')[0]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ArtistPage() {
  const { id } = useParams();
  const db = getDB();
  const artist = id ? db.artists.get(id) : undefined;
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  useEffect(() => { if (artist) document.title = `${artist.name} — Countercurrent`; }, [artist]);
  if (!artist) return <div><h1 className="font-serif font-black text-4xl">No file.</h1><p className="mt-2 font-serif">No artist at this address. Try the <Link className="underline" to="/artists">index</Link>.</p></div>;
  const pieces = db.articles.filter((a) => a.artistIds.includes(artist.id));
  const releases = [...db.releases.values()].filter((r) => r.artistId === artist.id).sort((a, b) => a.year - b.year);
  const labels = [...new Set(releases.map((r) => r.labelId))].map((l) => db.labels.get(l)).filter(Boolean);
  const peers = [...db.artists.values()].filter((a) => a.id !== artist.id && a.genreIds.some((g) => artist.genreIds.includes(g))).slice(0, 8);
  return (
    <div>
      <Breadcrumbs trail={[['Artists', '/artists'], [artist.name]]} />
      <header className="mt-3 grid lg:grid-cols-12 gap-6 border-b-[2.5px] border-[#191712] pb-6">
        <div className="lg:col-span-8">
          <p className="kicker text-[10.5px] text-[#a9321f] mb-1">Artist file · {pieces.length} pieces · {releases.length} releases documented</p>
          <h1 className="font-serif font-black headline-tight text-[40px] md:text-[60px]">{artist.name}</h1>
          <p className="font-mono text-[12px] tracking-[0.06em] uppercase text-[#3d3a30] mt-3">{artist.origin} · {artist.active}{artist.members ? ` · ${artist.members}` : ''}</p>
          <p className="font-serif text-[17px] leading-relaxed mt-4 max-w-2xl">{artist.description}</p>
          <p className="font-mono text-[11.5px] leading-relaxed text-[#3d3a30] border-l-2 border-[#a9321f] pl-3 mt-4 max-w-2xl"><span className="uppercase tracking-[0.12em] text-[#a9321f]">Verified: </span>{artist.factual}</p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {artist.genreIds.map((g) => <Link key={g} to={`/genres/${g}`} className="font-mono text-[11px] uppercase tracking-[0.06em] bg-[#191712] text-[#f2eee2] px-2.5 py-1 hover:bg-[#a9321f]">{db.genres.get(g)?.name}</Link>)}
          </div>
        </div>
        <aside className="lg:col-span-4">
          <div className="border border-[#191712] bg-[#efe7d3] p-4 lg:sticky lg:top-4">
            <p className="kicker text-[10px] text-[#6f6a5b] mb-2">Discography · on this site</p>
            {releases.map((r) => (
              <Link key={r.id} to={`/releases/${r.id}`} className="group flex items-baseline justify-between gap-2 py-2 border-t border-[#191712]/15 first:border-t-0">
                <span className="font-serif font-bold text-[15px] group-hover:text-[#a9321f] group-hover:underline underline-offset-2">{r.title}</span>
                <span className="font-mono text-[11px] text-[#6f6a5b] shrink-0">{r.year}</span>
              </Link>
            ))}
            <p className="kicker text-[10px] text-[#6f6a5b] mt-4 mb-1">Labels</p>
            <p className="font-mono text-[11.5px] leading-relaxed">{labels.map((l, i) => (<span key={l!.id}>{i > 0 && ' · '}<Link className="underline underline-offset-2 hover:text-[#a9321f]" to={`/labels/${l!.id}`}>{l!.name}</Link></span>))}</p>
          </div>
        </aside>
      </header>
      <div className="grid lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-8">
          <SectionHead kicker="Coverage" title={`On ${artist.name}`} />
          <div className="grid md:grid-cols-2 gap-x-8">{pieces.slice(0, 10).map((a) => <StandardCard key={a.id} article={a} />)}</div>
          {pieces.length > 10 && <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#6f6a5b] mt-2">+ {pieces.length - 10} more in the <Link className="underline" to={`/archive`}>archive</Link> — search “{artist.name}”.</p>}
        </div>
        <div className="lg:col-span-4 space-y-6">
          <nav aria-label="Neighbouring artists">
            <p className="kicker text-[10px] text-[#6f6a5b] mb-2">Neighbouring files · same desks</p>
            {peers.map((p) => (
              <Link key={p.id} to={`/artists/${p.id}`} className="block py-2 border-t border-[#191712]/15 first:border-t-0 font-serif font-bold text-[15px] hover:text-[#a9321f] hover:underline underline-offset-2">{p.name} <span className="font-mono font-normal text-[10px] uppercase text-[#6f6a5b]">· {p.origin.split(',')[0]}</span></Link>
            ))}
          </nav>
          <FromArchive excludeId={pieces[0]?.id} count={3} />
        </div>
      </div>
    </div>
  );
}

export function ReleasesIndex() {
  const db = getDB();
  const releases = [...db.releases.values()].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  return (
    <div>
      <Breadcrumbs trail={[['Releases']]} />
      <h1 className="font-serif font-black text-[36px] md:text-[50px] headline-tight mt-3">Releases</h1>
      <p className="font-serif text-[16px] text-[#3d3a30] mt-2">{releases.length} release files with verified metadata and linked criticism.</p>
      <div className="mt-6 max-w-4xl">
        {releases.map((r) => (
          <Link key={r.id} to={`/releases/${r.id}`} className="group grid grid-cols-[52px_1fr_auto] gap-3 items-baseline py-2.5 border-t border-[#191712]/20 first:border-t-0">
            <span className="font-mono text-[12px] text-[#a9321f] font-semibold">{r.year}</span>
            <span><span className="font-serif font-bold text-[16px] group-hover:text-[#a9321f] group-hover:underline underline-offset-2">{db.artists.get(r.artistId)?.name} — {r.title}</span><span className="block font-mono text-[10px] uppercase tracking-[0.06em] text-[#6f6a5b]">{db.labels.get(r.labelId)?.name} · {r.format}</span></span>
            <span className="font-mono text-[10.5px] text-[#6f6a5b]">{r.duration ?? ''}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ReleasePage() {
  const { id } = useParams();
  const db = getDB();
  const release = id ? db.releases.get(id) : undefined;
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  useEffect(() => { if (release) document.title = `${release.title} — Countercurrent`; }, [release]);
  if (!release) return <div><h1 className="font-serif font-black text-4xl">No file.</h1><p className="mt-2 font-serif">No release at this address. Try the <Link className="underline" to="/releases">index</Link>.</p></div>;
  const artist = db.artists.get(release.artistId);
  const label = db.labels.get(release.labelId);
  const pieces = db.articles.filter((a) => a.releaseIds.includes(release.id));
  const sameLabel = [...db.releases.values()].filter((r) => r.labelId === release.labelId && r.id !== release.id).slice(0, 5);
  const dims: [string, string][] = [['Instrumentation', release.instrumentation], ['Methods', release.methods], ['Timbre', release.timbre], ['Structure', release.structure], ['Lineage', release.lineage], ['Countercurrent note', release.criticalNote]];
  return (
    <div>
      <Breadcrumbs trail={[['Releases', '/releases'], [`${artist?.name} — ${release.title}`]]} />
      <header className="mt-3 border-b-[2.5px] border-[#191712] pb-6">
        <p className="kicker text-[10.5px] text-[#a9321f] mb-1">Release file · {pieces.length} linked {pieces.length === 1 ? 'piece' : 'pieces'}</p>
        <h1 className="font-serif font-black headline-tight text-[36px] md:text-[54px]">{release.title}</h1>
        <p className="font-serif text-[19px] mt-2">{artist && <Link to={`/artists/${artist.id}`} className="underline decoration-[#a9321f] underline-offset-4 hover:text-[#a9321f]">{artist.name}</Link>} <span className="text-[#6f6a5b]">· {release.year}{label && <span> · <Link to={`/labels/${label.id}`} className="underline underline-offset-2 hover:text-[#a9321f]">{label.name}</Link></span>} · {release.format}{release.duration ? ` · ${release.duration}` : ''}</span></p>
        <p className="font-mono text-[11.5px] leading-relaxed text-[#3d3a30] border-l-2 border-[#a9321f] pl-3 mt-4 max-w-3xl"><span className="uppercase tracking-[0.12em] text-[#a9321f]">Verified metadata: </span>{release.factual}</p>
      </header>
      <div className="grid lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-7">
          <h2 className="font-serif font-black text-[22px] mb-3">What the record does <span className="font-mono font-normal text-[10.5px] uppercase tracking-[0.1em] text-[#6f6a5b]">· Countercurrent analysis</span></h2>
          <dl className="space-y-4">
            {dims.map(([k, v]) => (
              <div key={k} className="border-t border-[#191712]/20 pt-3">
                <dt className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[#a9321f] mb-1">{k}</dt>
                <dd className="font-serif text-[16px] leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="font-mono text-[11px] text-[#6f6a5b] leading-relaxed mt-6 border-t border-[#191712]/25 pt-4">Above: Countercurrent critical description (our writers' analysis), except the verified metadata line. No quotations, interviews, or artist statements are presented — only listening.</p>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <section aria-label="Criticism of this release">
            <SectionHead kicker="Criticism" title="On this record" />
            {pieces.length ? pieces.slice(0, 8).map((a) => <CompactRow key={a.id} article={a} />) : <p className="font-serif italic">No dedicated piece yet — it appears in primers and lists. Try the artist file.</p>}
          </section>
          {sameLabel.length > 0 && (
            <nav aria-label="Same label">
              <p className="kicker text-[10px] text-[#6f6a5b] mb-2">Same label · {label?.name}</p>
              {sameLabel.map((r) => <Link key={r.id} to={`/releases/${r.id}`} className="block py-2 border-t border-[#191712]/15 first:border-t-0 font-serif font-bold text-[15px] hover:text-[#a9321f] hover:underline underline-offset-2">{db.artists.get(r.artistId)?.name} — {r.title} <span className="font-mono font-normal text-[10px] text-[#6f6a5b]">· {r.year}</span></Link>)}
            </nav>
          )}
          {artist && <Link to={`/artists/${artist.id}`} className="inline-block font-mono text-[11px] uppercase tracking-[0.1em] border border-[#191712] px-3 py-2 hover:bg-[#191712] hover:text-[#f2eee2]">Full {artist.name} file →</Link>}
        </div>
      </div>
    </div>
  );
}
