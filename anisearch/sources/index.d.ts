export type Speed = 'slow' | 'moderate' | 'fast'
export type Accuracy = 'low' | 'moderate' | 'high'
export type ServerLocations = 'US' | 'JP' | 'CN' | 'KR' | 'EU'

export interface SourceConfig {
  id: string
  name: string
  version: string
  main: string
  update: string
  type: string
  speed: Speed
  accuracy: Accuracy
  regions: ServerLocations[]
}

export interface TorrentResult {
  title: string
  link: string
  hash: string
  seeders: number
  leechers: number
  downloads: number
  size: number
  accuracy: Accuracy
  type?: 'best' | 'alt' | 'batch' | string
  date?: Date
}

export interface TorrentQuery {
  anilistId?: number
  anidbAid?: number
  anidbEid?: number
  titles?: string[]
  episodeCount?: number
}

export type SearchFunction = (options: TorrentQuery) => Promise<TorrentResult[]>

export interface TorrentSource {
  single: SearchFunction
  batch: SearchFunction
  movie: SearchFunction
  validate: () => Promise<boolean>
}
