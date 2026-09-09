import { useMemo } from 'react';
import { ARTISTS } from '../data/artists';
import { GENRES } from '../data/genres';
import { LABELS } from '../data/labels';
import { EXTRA_LABELS } from '../data/labels-extra';
import { WRITERS } from '../data/writers';
import { RELEASES } from '../data/catalog';
import { FEATURED_ARTICLES } from '../data/articles-featured';
import { EDITORIAL_ARTICLES } from '../data/essays';
import { buildArchive } from '../data/archive';
import type { Article, Artist, Genre, Label, Release, Writer } from '../lib/types';

let cache: {
  articles: Article[];
  artists: Map<string, Artist>;
  releases: Map<string, Release>;
  labels: Map<string, Label>;
  genres: Map<string, Genre>;
  writers: Map<string, Writer>;
  articlesById: Map<string, Article>;
  articlesBySlug: Map<string, Article>;
} | null = null;

export function getDB() {
  if (cache) return cache;
  const archive = buildArchive();
  const articles = [...FEATURED_ARTICLES, ...EDITORIAL_ARTICLES, ...archive].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );
  const allLabels = [...LABELS, ...EXTRA_LABELS];
  cache = {
    articles,
    artists: new Map(ARTISTS.map((a) => [a.id, a])),
    releases: new Map(RELEASES.map((r) => [r.id, r])),
    labels: new Map(allLabels.map((l) => [l.id, l])),
    genres: new Map(GENRES.map((g) => [g.id, g])),
    writers: new Map(WRITERS.map((w) => [w.id, w])),
    articlesById: new Map(articles.map((a) => [a.id, a])),
    articlesBySlug: new Map(articles.map((a) => [a.slug, a])),
  };
  return cache;
}

export function useDB() {
  return useMemo(() => getDB(), []);
}

export function relatedArticles(target: Article, all: Article[], limit = 5): { article: Article; reasons: string[] }[] {
  const scored: { article: Article; score: number; reasons: string[] }[] = [];
  for (const a of all) {
    if (a.id === target.id) continue;
    let score = 0;
    const reasons: string[] = [];
    const sharedArtists = a.artistIds.filter((x) => target.artistIds.includes(x));
    if (sharedArtists.length) {
      score += sharedArtists.length * 30;
      reasons.push(`Same artist: ${sharedArtists.length > 1 ? `${sharedArtists.length} shared` : 'file'}`);
    }
    const sharedReleases = a.releaseIds.filter((x) => target.releaseIds.includes(x));
    if (sharedReleases.length) {
      score += sharedReleases.length * 26;
      reasons.push('Same release');
    }
    const sharedGenres = a.genreIds.filter((x) => target.genreIds.includes(x));
    if (sharedGenres.length) {
      score += sharedGenres.length * 12;
      if (!reasons.length) reasons.push('Same desk');
    }
    const sharedLabels = a.labelIds.filter((x) => target.labelIds.includes(x));
    if (sharedLabels.length) {
      score += sharedLabels.length * 10;
      if (reasons.length < 2) reasons.push('Same label orbit');
    }
    const sharedTags = a.tags.filter((x) => target.tags.includes(x));
    if (sharedTags.length) {
      score += sharedTags.length * 6;
      if (reasons.length < 2) reasons.push(`Shared tag: ${sharedTags[0]}`);
    }
    if (a.writerId === target.writerId) {
      score += 5;
      if (reasons.length < 2) reasons.push('Same writer');
    }
    if (a.type === target.type) score += 2;
    if (score > 0) scored.push({ article: a, score, reasons: reasons.slice(0, 2) });
  }
  return scored
    .sort((x, y) => y.score - x.score || (x.article.publishedAt < y.article.publishedAt ? 1 : -1))
    .slice(0, limit)
    .map(({ article, reasons }) => ({ article, reasons }));
}
