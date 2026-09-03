export interface TorrentResult {
    title: string;
    link: string;
    hash: string;
    seeders: number;
    leechers: number;
    downloads: number;
    size: number;
    accuracy: 'high' | 'medium' | 'low';
    type?: 'batch';
    date?: Date;
}

export interface TorrentQuery {
    anilistId: number;
    episode: number;
    episodeCount: number;
    titles: string[];
    exclusions: string[];
    resolution: string;
}

export type SearchFunction = (opts: TorrentQuery) => Promise<TorrentResult[]>;

export interface TorrentSource {
    single: SearchFunction;
    batch: SearchFunction;
    movie: SearchFunction;
    validate: () => Promise<boolean>;
}
