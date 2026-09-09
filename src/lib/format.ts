export function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function yearOf(iso: string): number {
  return Number(iso.slice(0, 4));
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function ratingWord(r: number): string {
  if (r >= 9) return 'Essential';
  if (r >= 8) return 'Highly recommended';
  if (r >= 7) return 'Recommended';
  if (r >= 6) return 'Worthwhile';
  if (r >= 5) return 'Uneven';
  return 'For completists';
}

export function readingTime(body: string[]): number {
  const words = body.join(' ').split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

export function mulberry(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
