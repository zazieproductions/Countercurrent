import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Chrome';
import { getDB } from '../lib/db';

export default function About() {
  const db = getDB();
  return (
    <div className="max-w-3xl">
      <Breadcrumbs trail={[['About']]} />
      <p className="kicker text-[10.5px] text-[#a9321f] mt-3 mb-1">The publication · ethics · masthead · contact</p>
      <h1 className="font-serif font-black headline-tight text-[38px] md:text-[54px]">About Countercurrent</h1>
      <p className="font-serif text-[18px] leading-relaxed mt-4">Countercurrent is an independent journal of experimental and avant-garde music, published from London since 2011 — first as a photocopied review sheet sold at shows, now as this archive. We cover musique concrète and electroacoustic composition, noise and power electronics, industrial, ambient and drone, IDM and microsound, free improvisation, minimalism and spectralism, tape music and collage, outsider and DIY music, field recording and sound art, post-punk and no wave, shoegaze and post-rock, contemporary composition, and the crossings between them.</p>
      <div className="article-body font-serif text-[16.5px] leading-[1.7] mt-6">
        <h2 className="font-serif font-black text-[24px] mt-8 mb-2">What we believe a review should do</h2>
        <p>Describe what the music actually does: production, instrumentation, compositional method, timbre, structure, dynamics, recording technique, historical context, aesthetic lineage, and relationship to other works. Our house rules ban the easy moves — effortful claims that something is \u201cexperimental\u201d without saying how, and the review-words that stand in for listening. Every piece is signed and dated. Writers state their positions on their writer pages; disagreements between them are a feature.</p>
        <h2 id="ratings" className="font-serif font-black text-[24px] mt-8 mb-2">How we rate</h2>
        <p>Long reviews may carry a score from 0 to 10. The words matter more than the number, but the number means: 9.0+ essential — the strongest recommendation this publication gives; 8.0–8.9 highly recommended; 7.0–7.9 recommended; 6.0–6.9 worthwhile with reservations stated; 5.0–5.9 uneven, for the curious; below 5.0 for completists, with reasons. Short reviews, features, essays and columns are unscored. Scores are never sold, traded, or previewed to labels.</p>
        <h2 className="font-serif font-black text-[24px] mt-8 mb-2">Factual integrity</h2>
        <p>Release metadata — dates, labels, formats, personnel, studios, catalogue numbers — is checked against sleeves, label discographies, and primary sources, and presented in fact boxes visually separated from criticism. Critical commentary is signed opinion. We never invent quotations, interviews, review histories, artist statements, scores, release information, or biographical facts, and we never present generated editorial commentary as factual reporting. Where the archive is uncertain, it says so. Corrections are printed in the News section and appended to the piece.</p>
        <h2 id="masthead" className="font-serif font-black text-[24px] mt-8 mb-2">Masthead</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        {[...db.writers.values()].map((w) => (
          <Link key={w.id} to={`/writers/${w.id}`} className="border border-[#191712]/30 p-3 hover:bg-[#efe7d3] flex gap-3 items-center">
            <span className="w-10 h-10 bg-[#191712] text-[#f2eee2] font-mono text-[13px] flex items-center justify-center shrink-0">{w.initials}</span>
            <span><span className="font-serif font-bold text-[15.5px]">{w.name}</span><span className="block font-mono text-[10px] uppercase tracking-[0.06em] text-[#6f6a5b]">{w.role}</span></span>
          </Link>
        ))}
      </div>
      <div className="article-body font-serif text-[16.5px] leading-[1.7] mt-6">
        <h2 id="write" className="font-serif font-black text-[24px] mt-8 mb-2">Write for us</h2>
        <p>The desk wants pitches with a subject, a method, and evidence of listening: which records, which rooms, which sources. We value specificity over coverage — one well-heard record beats five skimmed ones. New writers start with short reviews. Payment is modest, prompt, and stated before commission. Write to the desk with two clips and one paragraph on what you would review and how.</p>
        <h2 className="font-serif font-black text-[24px] mt-8 mb-2">Support</h2>
        <p>No ads, no sponsors, no affiliate links dressed as criticism. The journal is reader-supported. If the archive has given you a rabbit hole worth falling down, that is the business model working.</p>
      </div>
    </div>
  );
}