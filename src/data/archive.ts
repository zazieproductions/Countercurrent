import type { Article, ArticleType } from '../lib/types';
import { RELEASES } from './catalog';
import { ARTISTS } from './artists';
import { LABELS } from './labels';
import { EXTRA_LABELS } from './labels-extra';
import { GENRES } from './genres';
import { mulberry } from '../lib/format';

const ALL_LABELS = [...LABELS, ...EXTRA_LABELS];
const artistById = new Map(ARTISTS.map((a) => [a.id, a]));
const labelById = new Map(ALL_LABELS.map((l) => [l.id, l]));
const genreById = new Map(GENRES.map((g) => [g.id, g]));

function issueForDate(iso: string): number {
  // Issue CC-168 corresponds to August 2026; earlier months count back.
  const ref = 168;
  const y = Number(iso.slice(0, 4));
  const m = Number(iso.slice(5, 7));
  const diff = (2026 - y) * 12 + (8 - m);
  return Math.max(1, ref - diff);
}

const GENRE_WRITERS: Record<string, string[]> = {
  'musique-concrete': ['a-lindqvist', 'm-okafor', 's-ito'],
  noise: ['j-vane', 'h-abe', 'd-priest'],
  'power-electronics': ['j-vane', 'g-okafor-reese'],
  industrial: ['j-vane', 'k-marsh', 'n-ferreira'],
  ambient: ['e-vasquez', 's-ito', 'd-priest'],
  drone: ['d-priest', 'm-okafor', 'e-vasquez'],
  idm: ['t-osei', 's-ito'],
  lowercase: ['s-ito', 'f-dubois'],
  'free-improv': ['r-halloway', 'm-okafor'],
  minimalism: ['m-okafor', 'e-vasquez', 'r-halloway'],
  spectralism: ['m-okafor', 'e-vasquez'],
  'tape-music': ['a-lindqvist', 't-osei', 'f-dubois'],
  outsider: ['k-marsh', 'p-ndlovu', 'g-okafor-reese'],
  'field-recording': ['s-ito', 'p-ndlovu', 'f-dubois'],
  'experimental-electronic': ['t-osei', 'm-okafor', 'p-ndlovu'],
  'post-punk': ['k-marsh', 'j-vane'],
  shoegaze: ['k-marsh', 'e-vasquez', 'd-priest'],
  contemporary: ['m-okafor', 'e-vasquez', 'r-halloway'],
  krautrock: ['k-marsh', 't-osei'],
  'breakcore-club': ['t-osei', 'p-ndlovu'],
};

const OPENINGS = [
  (a: string, t: string, y: number, l: string) =>
    `Put ${t} on and the first thing you notice is how little it resembles the category it is filed under. ${a} recorded it in ${y} for ${l}, and from the opening minutes the record insists on its own terms: a specific room, a specific rig, a set of decisions about duration and density that no genre tag quite contains.`,
  (a: string, t: string, y: number, l: string) =>
    `The reputation of ${t} tends to arrive before the music does. Strip that away and what remains is a ${y} ${l} record of unusual directness: ${a} stating a method and then following it further than comfort suggests. This review starts from the tape, not the story.`,
  (a: string, t: string, y: number, l: string) =>
    `Some records document a performance; ${t} documents a system. The ${y} ${l} sessions find ${a} setting up conditions — instruments, tunings, edit logic — and then living inside them for the length of the album. What follows is an account of those conditions and what they produce.`,
  (a: string, t: string, y: number, l: string) =>
    `Returning to ${t} years after its ${y} appearance on ${l}, what strikes this listener first is the recording itself: close, deliberate, unwilling to hide behind atmosphere. ${a} puts the working method in the foreground, and the album is better for it.`,
  (a: string, t: string, y: number, l: string) =>
    `${t} (${y}, ${l}) is one of those records people describe by reputation rather than by content. The content repays description. ${a} works here with narrow means and wide attention, and the narrowness is the point.`,
];

const MID_INSTR = [
  (r: { instrumentation: string; methods: string }) =>
    `The instrumentation tells most of the story. ${r.instrumentation} That is nearly the whole inventory, and the record\u2019s achievement is how much behaviour it draws from so little. ${r.methods}`,
  (r: { instrumentation: string; methods: string }) =>
    `On equipment: ${r.instrumentation} The method follows the means. ${r.methods} Nothing here is disguised by production; the takes sound like the room they were made in, and the room sounds like part of the band.`,
  (r: { instrumentation: string; methods: string }) =>
    `Listen to the staging first. ${r.instrumentation} Then notice how it is handled: ${r.methods} The handling is the musicianship — choices of level, placement, and patience that no amount of gear can substitute for.`,
];

const MID_TIMBRE = [
  (r: { timbre: string; structure: string }) =>
    `In the ear, that means the following. ${r.timbre} Structurally, the album organises this as ${r.structure.toLowerCase()} The proportions matter more than any single moment: this is music about how long things last and what changes while they last.`,
  (r: { timbre: string; structure: string }) =>
    `Timbre first, because timbre is doing the composing. ${r.timbre} The formal answer to that material is ${r.structure.toLowerCase()} — a shape that lets the sound\u2019s behaviour dictate the clock rather than the reverse.`,
  (r: { timbre: string; structure: string }) =>
    `What you actually hear, minute to minute: ${r.timbre} The record sequences that material as ${r.structure.toLowerCase()} It is a demanding shape on paper and a natural one in practice, because each section prepares the ear for the next.`,
];

const MID_LINEAGE = [
  (r: { lineage: string; criticalNote: string }) =>
    `Placed historically, ${r.lineage.toLowerCase()} That lineage clarifies without containing the record — ${t_last(r.criticalNote)}`,
  (r: { lineage: string; criticalNote: string }) =>
    `The aesthetic neighbours are instructive. ${r.lineage} But the comparison only goes so far. ${r.criticalNote}`,
];

function t_last(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

const CLOSERS = [
  (a: string, t: string) =>
    `None of this requires special pleading. ${t} earns its place the ordinary way: distinctive sound, deliberate form, and the sense throughout that ${a} knew exactly what each piece needed and stopped there. Recommended without caveats for anyone following this corner of the catalogue — and a sturdy door into it for anyone else.`,
  (a: string, t: string) =>
    `The test this publication applies is simple: does the record do something only it does, and does it do it all the way through? ${t} passes on both counts. ${a} holds the method steady from first minute to last, and the steadiness accumulates into something closer to conviction than to style.`,
  (a: string, t: string) =>
    `Play it on a system that reaches down and in a room that stays quiet, and ${t} gives back more than it promises. ${a} made a record of unusual focus; focus, sustained this long, becomes its own kind of generosity.`,
  (a: string, t: string) =>
    `There are more famous records in this territory and few better ones. ${t} belongs in the working collection — the shelf of albums critics actually return to when the reviewing week ends. ${a} at full attention, recorded honestly. That remains rarer than it should be.`,
];

const SHORT_TEMPLATES = [
  (a: string, t: string, y: number, r: { instrumentation: string; timbre: string; structure: string; criticalNote: string }) =>
    `${a} \u2014 ${t} (${y}). ${r.instrumentation} ${r.timbre} The record moves as ${r.structure.toLowerCase()} ${r.criticalNote}`,
  (a: string, t: string, y: number, r: { methods: string; timbre: string; lineage: string }) =>
    `${t} finds ${a} working a tight brief (${y}): ${r.methods} The result sounds like ${t_last(r.timbre)} ${r.lineage}`,
];

function pick<T>(rnd: () => number, arr: T[]): T {
  return arr[Math.floor(rnd() * arr.length)];
}

function dateFor(index: number, total: number): string {
  // Spread across 2012-01 to 2026-08 deterministically
  const start = Date.UTC(2012, 0, 5);
  const end = Date.UTC(2026, 7, 20);
  const t = total <= 1 ? 0 : index / (total - 1);
  // jitter via mulberry
  const rnd = mulberry(index * 7919 + 13);
  const jitter = (rnd() - 0.5) * (1000 * 60 * 60 * 24 * 20);
  const d = new Date(start + t * (end - start) + jitter);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(Math.min(28, Math.max(1, d.getUTCDate()))).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

const TITLE_PATTERNS = [
  (t: string) => `${t}: holding the state until it speaks`,
  (t: string) => `${t}, heard whole`,
  (t: string) => `Inside ${t}: method, timbre, duration`,
  (t: string) => `${t} and the discipline of the long take`,
  (t: string) => `Rehearing ${t}: what the room kept`,
];

export function buildArchive(): Article[] {
  const out: Article[] = [];
  const total = RELEASES.length;
  RELEASES.forEach((r, i) => {
    const artist = artistById.get(r.artistId);
    const label = labelById.get(r.labelId);
    if (!artist) return;
    const g0 = artist.genreIds[0] ?? 'experimental-electronic';
    const writers = GENRE_WRITERS[g0] ?? ['m-okafor', 't-osei'];
    const rnd = mulberry(i * 2654435761 % 2147483647);
    const writerId = writers[i % writers.length];
    const long = i % 3 !== 2; // ~2/3 long reviews
    const date = dateFor(i, total);
    const issueNo = issueForDate(date);
    const labelName = label?.name ?? 'Private press';
    const genreIds = artist.genreIds.slice(0, 2);
    const tagPool = [
      ...(genreById.get(g0)?.short ? [genreById.get(g0)!.short] : []),
      String(r.year),
      labelName,
      ...(r.year < 1980 ? ['1960s–70s'] : r.year < 1990 ? ['1980s'] : r.year < 2000 ? ['1990s'] : r.year < 2010 ? ['2000s'] : ['2010s–20s']),
    ];
    const rating = long ? Math.round((6.8 + rnd() * 2.7) * 10) / 10 : undefined;
    if (long) {
      const open = pick(rnd, OPENINGS)(artist.name, r.title, r.year, labelName);
      const mid1 = pick(rnd, MID_INSTR)({ instrumentation: r.instrumentation, methods: r.methods });
      const mid2 = pick(rnd, MID_TIMBRE)({ timbre: r.timbre, structure: r.structure });
      const mid3 = pick(rnd, MID_LINEAGE)({ lineage: r.lineage, criticalNote: r.criticalNote });
      const close = pick(rnd, CLOSERS)(artist.name, r.title);
      // writer-flavoured second paragraph extension
      const voice =
        writerId === 'j-vane'
          ? ` Note the gain staging throughout: levels pushed until the equipment reports back, distortion admitted as information rather than error.`
          : writerId === 's-ito'
            ? ` Small events carry disproportionate weight here; the mastering engineers deserve credit for preserving low-level detail most editions would crush.`
            : writerId === 'm-okafor'
              ? ` The proportions repay score-like attention: track the recurrences and the piece\u2019s formal argument comes into focus.`
              : writerId === 'r-halloway'
                ? ` Listen too for interaction — who cues whom, where density gathers, where players leave space for others to fill.`
                : writerId === 't-osei'
                  ? ` The rhythmic layering rewards producer attention: grids, kits, and mix placement doing structural work.`
                  : writerId === 'f-dubois'
                    ? ` The record-playback chain matters: microphone choice, tape speed, and mix decisions are audible as compositional acts.`
                    : writerId === 'd-priest'
                      ? ` Duration is doing structural work: the length lets each state fully declare itself before the next arrives.`
                      : ` The sequencing teaches the listening: each track resets the ear just enough for the next to land.`;
      const body = [open, mid1 + voice, mid2, mid3, close];
      const titlePat = pick(rnd, TITLE_PATTERNS)(r.title);
      out.push({
        id: `r${String(i + 1).padStart(3, '0')}`,
        slug: slugify(`${artist.name} ${r.title} review`),
        type: 'review',
        title: titlePat,
        dek: `${artist.name} \u2014 ${r.title} (${r.year}, ${labelName}). ${r.criticalNote}`,
        writerId,
        publishedAt: date,
        issueNo,
        catalogNo: `CC-${issueNo}-${String.fromCharCode(65 + (i % 6))}`,
        readingMinutes: Math.max(4, Math.round(body.join(' ').split(/\s+/).length / 200)),
        rating,
        artistIds: [r.artistId],
        releaseIds: [r.id],
        labelIds: [r.labelId],
        genreIds,
        tags: [...new Set(tagPool)].slice(0, 4),
        pullQuote: r.criticalNote,
        body,
        factBox: [
          `${r.title} \u2014 ${artist.name} (${r.year}, ${labelName})`,
          `Format: ${r.format}${r.duration ? `; duration ${r.duration}` : ''}`,
          artist.factual,
          `Filed under: ${genreIds.map((g) => genreById.get(g)?.name ?? g).join('; ')}`,
        ],
        listenTo: buildListenTo(r.artistId, g0),
      });
    } else {
      const bodyText = pick(rnd, SHORT_TEMPLATES)(artist.name, r.title, r.year, {
        instrumentation: r.instrumentation,
        timbre: r.timbre,
        structure: r.structure,
        criticalNote: r.criticalNote,
        methods: r.methods,
        lineage: r.lineage,
      });
      const second =
        `Worth hearing for ${r.duration ? `the full ${r.duration}` : 'the duration'}; filed here as ${genreById.get(g0)?.short ?? g0} with attention to ${writerId === 'f-dubois' ? 'the recording chain' : writerId === 'd-priest' ? 'duration and weight' : 'form and timbre'}.`;
      out.push({
        id: `r${String(i + 1).padStart(3, '0')}`,
        slug: slugify(`${artist.name} ${r.title} short review`),
        type: 'short-review',
        title: `${r.title} — ${artist.name} (short review)`,
        dek: `${artist.name}, ${r.title} (${r.year}, ${labelName}): ${r.timbre}`,
        writerId,
        publishedAt: date,
        issueNo,
        catalogNo: `CC-${issueNo}-S${i % 9}`,
        readingMinutes: 2,
        artistIds: [r.artistId],
        releaseIds: [r.id],
        labelIds: [r.labelId],
        genreIds,
        tags: [...new Set(tagPool)].slice(0, 4),
        body: [bodyText, second],
        factBox: [`${r.title} \u2014 ${artist.name} (${r.year}, ${labelName}); ${r.format}`],
      });
    }
  });

  // Year-by-year rediscoveries / retrospectives for older releases
  const retroTargets = RELEASES.filter((r) => r.year < 1995).slice(0, 24);
  retroTargets.forEach((r, k) => {
    const artist = artistById.get(r.artistId)!;
    const label = labelById.get(r.labelId);
    const rnd = mulberry(k * 40503 + 99);
    const writerId = pick(rnd, ['a-lindqvist', 'k-marsh', 'm-okafor', 'j-vane']);
    const date = dateFor(200 + k, 400);
    const issueNo = issueForDate(date);
    out.push({
      id: `x-retro-${k}`,
      slug: slugify(`from the archive ${artist.name} ${r.title}`),
      type: k % 2 === 0 ? 'rediscovery' : 'retrospective',
      title: `From the Archive: ${artist.name} \u2014 ${r.title} (${r.year})`,
      dek: `Revisiting ${r.title}: ${r.lineage} An archival hearing of the ${label?.name ?? ''} original and what it clarifies now.`,
      writerId,
      publishedAt: date,
      issueNo,
      catalogNo: `CC-${issueNo}-R${k}`,
      readingMinutes: 6 + (k % 4),
      rating: Math.round((7.5 + rnd() * 2) * 10) / 10,
      artistIds: [r.artistId],
      releaseIds: [r.id],
      labelIds: [r.labelId],
      genreIds: artist.genreIds.slice(0, 2),
      tags: ['From the Archive', String(r.year), label?.name ?? 'archive'],
      archival: true,
      body: [
        `Archive work starts from the object. The ${label?.name ?? 'original'} pressing of ${r.title} presents ${artist.name} with unusual plainness: ${r.instrumentation} No period styling, no remastering gloss — the 2020s listener hears substantially what the ${r.year} buyer heard, which is the point of returning to it.`,
        `What the record clarifies now concerns method. ${r.methods} At the time this read as necessity or eccentricity; with decades of successors behind it, it reads as decision. ${r.criticalNote}`,
        `The sound itself has aged in revealing ways. ${r.timbre} Where contemporaries chased fidelity or effect, this record chased behaviour — setting materials in motion and documenting what they do. ${r.structure}`,
        `This publication\u2019s line on reissues applies: review the argument, not just the sound. The argument here — ${t_last(r.lineage)} — holds. If the original is out of reach, any honest transfer serves; the music\u2019s demands (attention, volume discipline, patience) cost nothing. File under essential back catalogue.`,
      ],
      factBox: [`Original: ${r.year}, ${label?.name ?? 'private press'} (${r.format})`, artist.factual, `Duration: ${r.duration ?? 'see discography'}`],
      listenTo: buildListenTo(r.artistId, artist.genreIds[0] ?? 'drone'),
    });
  });

  // Label spotlights (short profiles) for labels not covered in essays
  const labelSpot = ALL_LABELS.filter((l) => l.specialties.length > 0).slice(0, 30);
  labelSpot.forEach((l, k) => {
    const rnd = mulberry(k * 65537 + 7);
    const date = dateFor(120 + k, 400);
    const issueNo = issueForDate(date);
    const rels = RELEASES.filter((r) => r.labelId === l.id).slice(0, 3);
    out.push({
      id: `x-label-${k}`,
      slug: slugify(`label spotlight ${l.name}`),
      type: 'label-profile',
      title: `Label Spotlight: ${l.name}`,
      dek: `${l.location}, since ${l.founded}. ${l.specialties.join(' \u00b7 ')} — a working guide to the catalogue and where to start.`,
      writerId: 'n-ferreira',
      publishedAt: date,
      issueNo,
      catalogNo: `CC-${issueNo}-L${k}`,
      readingMinutes: 6,
      artistIds: rels.map((r) => r.artistId),
      releaseIds: rels.map((r) => r.id),
      labelIds: [l.id],
      genreIds: [],
      tags: ['label profile', l.name, String(l.founded)],
      body: [
        `${l.name} (${l.location}, founded ${l.founded}${l.founder ? ` by ${l.founder}` : ''}) ${t_last(l.description)} Status at last check: ${t_last(l.status)}.`,
        `Where to start: ${rels.length ? rels.map((r) => `${artistById.get(r.artistId)?.name} \u2014 ${r.title} (${r.year})`).join('; ') : 'follow the catalogue numerically; the early numbers teach the house style.'} Each demonstrates the label\u2019s working method — few releases per year, total commitment per release, sleeves that tell the truth about the sound.`,
        `How to buy, since infrastructure matters: prefer the label\u2019s own outlet and the shops that stocked it early. Reissue money is infrastructure money. This catalogue earned it.`,
      ],
      factBox: [`Founded ${l.founded}, ${l.location}`, `Status: ${l.status}`, `Coverage: ${l.specialties.join(', ')}`],
    });
  });

  // Columns: generated instalments for recurring columns
  const columnDefs: { writerId: string; tag: string; title: (n: number) => string; seedTopics: string[] }[] = [
    { writerId: 'd-priest', tag: 'Slow Circuit', title: (n) => `Slow Circuit No. ${n}: weight, patience, and the riff as drone`, seedTopics: ['amplifier worship', 'repetition', 'duration', 'low end', 'crescendo'] },
    { writerId: 's-ito', tag: 'Threshold', title: (n) => `Threshold No. ${n}: notes from the quiet shelf`, seedTopics: ['microsound', 'mastering', 'room tone', 'silence', 'surfaces'] },
    { writerId: 'f-dubois', tag: 'Signal Path', title: (n) => `Signal Path No. ${n}: machines, rooms, and honest levels`, seedTopics: ['tape speed', 'microphones', 'mixing', 'filters', 'monitoring'] },
    { writerId: 'g-okafor-reese', tag: 'The Counter', title: (n) => `The Counter No. ${n}: a minority report`, seedTopics: ['canon', 'consensus', 'lists', 'nostalgia', 'hype'] },
    { writerId: 'k-marsh', tag: 'Second Pressing', title: (n) => `Second Pressing No. ${n}: memory, pressing, myth`, seedTopics: ['reissues', 'scenes', 'venues', 'pressing runs', 'oral history'] },
  ];
  let cn = 0;
  columnDefs.forEach((c, ci) => {
    for (let n = 1; n <= 5; n++) {
      const rnd = mulberry(ci * 1000 + n * 77);
      const rel = RELEASES[Math.floor(rnd() * RELEASES.length)];
      const artist = artistById.get(rel.artistId)!;
      const topic = c.seedTopics[Math.floor(rnd() * c.seedTopics.length)];
      const date = dateFor(260 + cn * 3, 420);
      const issueNo = issueForDate(date);
      out.push({
        id: `x-col-${ci}-${n}`,
        slug: slugify(`${c.tag} no ${n} ${topic} ${rel.title}`),
        type: 'column',
        title: c.title(n),
        dek: `${c.tag} on ${topic}, with ${artist.name} \u2014 ${rel.title} on the desk and the volume set honestly.`,
        writerId: c.writerId,
        publishedAt: date,
        issueNo,
        catalogNo: `CC-${issueNo}-C${cn}`,
        readingMinutes: 5 + (cn % 3),
        artistIds: [rel.artistId],
        releaseIds: [rel.id],
        labelIds: [rel.labelId],
        genreIds: artist.genreIds.slice(0, 1),
        tags: [c.tag, topic, artist.name],
        body: [
          `This month\u2019s ${c.tag.toLowerCase()} starts from an object on the desk: ${artist.name} \u2014 ${rel.title} (${rel.year}). The nominal subject is ${topic}; the actual subject, as usual, is attention. ${rel.criticalNote}`,
          `A working note. ${rel.methods} Applied to ${topic}, that means: set levels so the quietest event is audible, give each state time to declare itself, and resist narrating over the sound. The column\u2019s rule holds — describe what the music does before deciding what it means.`,
          `So: ${rel.timbre} ${rel.structure} File the observation under ${topic} and return to the record, which remains the better writer on all of this.`,
        ],
        factBox: [`Column: ${c.tag}`, `Desk copy: ${artist.name} \u2014 ${rel.title} (${rel.year})`],
      });
      cn++;
    }
  });

  // Genre primers generated for each genre hub (short guides)
  GENRES.forEach((g, k) => {
    const rnd = mulberry(k * 31337 + 5);
    const rels = RELEASES.filter((r) => {
      const a = artistById.get(r.artistId);
      return a?.genreIds.includes(g.id);
    }).slice(0, 4);
    if (rels.length === 0) return;
    const date = dateFor(60 + k, 400);
    const issueNo = issueForDate(date);
    const writers = GENRE_WRITERS[g.id] ?? ['m-okafor'];
    out.push({
      id: `x-genre-${g.id}`,
      slug: slugify(`primer ${g.name}`),
      type: 'primer',
      title: `Primer: ${g.name}`,
      dek: `${g.description} Where to start, what to hear for, and which four records teach the method fastest.`,
      writerId: writers[0],
      publishedAt: date,
      issueNo,
      catalogNo: `CC-${issueNo}-P${k}`,
      readingMinutes: 8,
      artistIds: rels.map((r) => r.artistId),
      releaseIds: rels.map((r) => r.id),
      labelIds: [...new Set(rels.map((r) => r.labelId))],
      genreIds: [g.id],
      tags: ['primer', 'begin here', g.short],
      body: [
        `${g.name} names a practice before it names a sound. ${g.description} The lineage runs through ${g.lineage.join(', ')} — but lineage misleads if it suggests agreement. The figures below (${g.keyFigures.join(', ')}) disagree about fundamentals, which is what makes the territory worth mapping.`,
        `What to hear for. First, the sound sources and how they are staged: ${rels[0] ? artistById.get(rels[0].artistId)?.name + ' \u2014 ' + rels[0].instrumentation : ''} Second, the formal question each piece answers — how long states last, what changes, what is allowed to recur. Third, the room: these records were made in specific places with specific limits, and the limits are audible as decisions.`,
        `Four records that teach the method: ${rels.map((r) => `${artistById.get(r.artistId)?.name} \u2014 ${r.title} (${r.year})`).join('; ')}. Take them in order, at honest volume, with attention. Then follow the tags — every entry below connects outward to reviews, features, and the artists\u2019 full Countercurrent files.`,
      ],
      factBox: [`Lineage: ${g.lineage.join('; ')}`, `Key figures: ${g.keyFigures.join('; ')}`, `Start here: ${rels.map((r) => r.title).join('; ')}`],
      listenTo: rels.map((r) => `${artistById.get(r.artistId)?.name} \u2014 ${r.title}`),
    });
  });

  // News desk: issue notes + listening notes (meta, no invented external facts)
  const newsTitles: [string, string][] = [
    ['Inside this month\u2019s issue: what the desk is playing', 'A notebook of current listening, archival arrivals, and corrections.'],
    ['From the inbox: transfers, re-presses, and honest editions', 'How this desk evaluates archival arrivals before reviewing them.'],
    ['Corrections and clarifications: the desk keeps a ledger', 'What we got wrong, what the tape boxes said, and what changed.'],
    ['Listening groups: how to run a slow-listening session', 'One record, one room, no phones. A practical guide from reader reports.'],
    ['How we rate: a note on scores, stars, and strong opinions', 'What a Countercurrent number means — and what it refuses to mean.'],
    ['The archive grows: new back-catalogue entries this month', 'Fresh release entries, corrected metadata, and expanded cross-links.'],
    ['Reading the credits: who transferred, who annotated, who consented', 'A checklist for evaluating any archival edition, with examples from this site.'],
    ['Rooms matter: a short guide to listening levels', 'Why quiet records need honest gain and loud records need honest rooms.'],
    ['Second-hand strategies: buying the underground used', 'Pressings, price discipline, and when to wait for the reissue.'],
    ['Write for us: what the desk wants from pitches', 'Subjects, methods, and the difference between an opinion and a review.'],
  ];
  newsTitles.forEach(([t, d], k) => {
    const rnd = mulberry(k * 911 + 31);
    const rel = RELEASES[Math.floor(rnd() * RELEASES.length)];
    const artist = artistById.get(rel.artistId)!;
    const date = dateFor(300 + k * 4, 420);
    const issueNo = issueForDate(date);
    out.push({
      id: `x-news-${k}`,
      slug: slugify(`news desk ${t}`),
      type: 'news',
      title: t,
      dek: d,
      writerId: 'n-ferreira',
      publishedAt: date,
      issueNo,
      catalogNo: `CC-${issueNo}-N${k}`,
      readingMinutes: 3 + (k % 3),
      artistIds: [rel.artistId],
      releaseIds: [rel.id],
      labelIds: [rel.labelId],
      genreIds: artist.genreIds.slice(0, 1),
      tags: ['News desk', 'notes'],
      body: [
        `From the news desk. ${d} This week\u2019s desk copy includes ${artist.name} \u2014 ${rel.title} (${rel.year}), which ${t_last(rel.criticalNote)} The note below is editorial process, not announcement: check label and artist outlets for confirmed details before acting on anything resembling news.`,
        `Method, since readers ask. This desk distinguishes three things: confirmed releases (heard or handled), public announcements (linked, dated, sourced), and rumour (unprinted). Anything below that standard appears as listening notes, clearly marked. ${rel.methods}`,
        `Meanwhile the archive work continues: metadata corrected against sleeves, cross-links expanded, back numbers kept in print on this site. If you spot an error — a wrong year, a misattributed label, a broken lineage — write in. The ledger is public and the corrections are printed.`,
      ],
      factBox: ['Desk: News & Labels (Nadia Ferreira)', 'Policy: announcements sourced; rumours unprinted', `Desk copy: ${artist.name} \u2014 ${rel.title} (${rel.year})`],
    });
  });

  // Lists: graded entry points per genre cluster
  const listDefs = [
    { title: 'Five records that teach duration', genre: 'drone' },
    { title: 'Five records that teach the edit', genre: 'tape-music' },
    { title: 'Five quiet records that demand honest gain', genre: 'lowercase' },
    { title: 'Five rhythm records for people who distrust rhythm', genre: 'idm' },
    { title: 'Five guitar records that stopped behaving like guitar records', genre: 'post-punk' },
  ];
  listDefs.forEach((ld, k) => {
    const rels = RELEASES.filter((r) => artistById.get(r.artistId)?.genreIds.includes(ld.genre)).slice(0, 5);
    if (!rels.length) return;
    const date = dateFor(340 + k * 5, 420);
    const issueNo = issueForDate(date);
    out.push({
      id: `x-list-${k}`,
      slug: slugify(ld.title),
      type: 'list',
      title: ld.title.charAt(0).toUpperCase() + ld.title.slice(1),
      dek: `A graded shelf: ${rels.map((r) => r.title).join(' \u00b7 ')}. Start at one end; the other end will make sense later.`,
      writerId: ['d-priest', 'a-lindqvist', 's-ito', 't-osei', 'k-marsh'][k % 5],
      publishedAt: date,
      issueNo,
      catalogNo: `CC-${issueNo}-X${k}`,
      readingMinutes: 7,
      artistIds: rels.map((r) => r.artistId),
      releaseIds: rels.map((r) => r.id),
      labelIds: [...new Set(rels.map((r) => r.labelId))],
      genreIds: [ld.genre],
      tags: ['list', 'begin here', ld.genre],
      body: [
        `A graded shelf, ordered for stamina. ${rels.map((r, j) => `${j + 1}) ${artistById.get(r.artistId)?.name} \u2014 ${r.title} (${r.year}): ${t_last(r.criticalNote)}`).join(' ')}`,
        `How to use it: one record per sitting, honest volume, no skipping. Each entry has a full review and release file elsewhere on this site — follow the links, not the algorithm. The shelf is the start of the rabbit hole, not the hole itself.`,
      ],
      factBox: rels.map((r) => `${artistById.get(r.artistId)?.name} \u2014 ${r.title} (${r.year})`),
      listenTo: rels.map((r) => `${artistById.get(r.artistId)?.name} \u2014 ${r.title}`),
    });
  });

  // Deduplicate slugs
  const seen = new Set<string>();
  out.forEach((a) => {
    let s = a.slug;
    let n = 2;
    while (seen.has(s)) {
      s = `${a.slug}-${n}`;
      n++;
    }
    a.slug = s;
    seen.add(s);
  });

  return out.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

function buildListenTo(artistId: string, genreId: string): string[] {
  const rels = RELEASES.filter((r) => {
    if (r.artistId === artistId) return false;
    const a = artistById.get(r.artistId);
    return a?.genreIds.includes(genreId);
  }).slice(0, 3);
  return rels.map((r) => `${artistById.get(r.artistId)?.name} \u2014 ${r.title}`);
}
