export type ArticleType =
  | 'review'
  | 'short-review'
  | 'retrospective'
  | 'feature'
  | 'essay'
  | 'primer'
  | 'label-profile'
  | 'scene-history'
  | 'column'
  | 'list'
  | 'technical'
  | 'news'
  | 'rediscovery';

export interface Writer {
  id: string;
  name: string;
  role: string;
  beat: string;
  bio: string;
  location: string;
  since: number;
  initials: string;
  stance: string;
}

export interface Genre {
  id: string;
  name: string;
  short: string;
  description: string;
  lineage: string[];
  keyFigures: string[];
  color: string;
}

export interface Label {
  id: string;
  name: string;
  founded: number;
  location: string;
  founder?: string;
  status: string;
  description: string;
  specialties: string[];
}

export interface Artist {
  id: string;
  name: string;
  origin: string;
  formed?: number;
  active: string;
  members?: string;
  description: string;
  factual: string;
  genreIds: string[];
  labelIds: string[];
}

export interface Release {
  id: string;
  title: string;
  artistId: string;
  year: number;
  labelId: string;
  format: string;
  factual: string;
  instrumentation: string;
  methods: string;
  timbre: string;
  structure: string;
  lineage: string;
  criticalNote: string;
  duration?: string;
}

export interface Article {
  id: string;
  slug: string;
  type: ArticleType;
  title: string;
  dek: string;
  writerId: string;
  publishedAt: string;
  issueNo: number;
  catalogNo: string;
  readingMinutes: number;
  rating?: number;
  artistIds: string[];
  releaseIds: string[];
  labelIds: string[];
  genreIds: string[];
  tags: string[];
  featured?: boolean;
  editorsPick?: boolean;
  archival?: boolean;
  pullQuote?: string;
  body: string[];
  factBox?: string[];
  listenTo?: string[];
}

export const TYPE_LABELS: Record<ArticleType, string> = {
  review: 'Review',
  'short-review': 'Short Review',
  retrospective: 'Retrospective',
  feature: 'Feature',
  essay: 'Essay',
  primer: 'Primer',
  'label-profile': 'Label Profile',
  'scene-history': 'Scene History',
  column: 'Column',
  list: 'List',
  technical: 'Technical',
  news: 'News',
  rediscovery: 'Rediscovery',
};

export const SECTION_FOR_TYPE: Record<ArticleType, string> = {
  review: 'Reviews',
  'short-review': 'Reviews',
  retrospective: 'Features',
  feature: 'Features',
  essay: 'Essays',
  primer: 'Features',
  'label-profile': 'Features',
  'scene-history': 'Features',
  column: 'Columns',
  list: 'Features',
  technical: 'Essays',
  news: 'News',
  rediscovery: 'Features',
};
