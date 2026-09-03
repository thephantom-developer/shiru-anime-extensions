export type Speed = 'fast' | 'moderate' | 'slow';
export type Accuracy = 'high' | 'medium' | 'low';
export type ServerLocations = string;

export interface SourceConfig {
  id: string;
  name: string;
  version: string;
  main: string;
  update: string;
  type: string;
  speed: Speed;
  accuracy: Accuracy;
  unregulated?: boolean;
  regions: ServerLocations[];
  description: string;
}

export interface TorrentResult {
  title: string;
  link: string;
  hash: string;
  seeders: number;
  leechers: number;
  downloads: number;
  size: number;
  accuracy: Accuracy;
  type?: string;
  date?: Date;
}

export interface TorrentQuery {
  titles: string[];
  resolution?: string;
  exclusions?: string[];
}

export type SearchFunction = (query: TorrentQuery) => Promise<TorrentResult[]>;

export interface TorrentSource {
  url: string;
  single: SearchFunction;
  batch: SearchFunction;
  movie: SearchFunction;
  validate: () => Promise<boolean>;
}
