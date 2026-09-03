export interface SeaDex {
  items: SeaDexEntry[]
}
export interface SeaDexEntry {
  expand?: { trs?: SeaDexTorrent[] }
}
export interface SeaDexTorrent {
  infoHash: string
  files: { name: string, length: number }[]
  releaseGroup: string
  dualAudio: boolean
  isBest: boolean
  created: string
}
export interface ToshoEntry {
  title: string
  link: string
  torrent_url: string
  magnet_uri: string
  info_hash: string
  seeders: number
  leechers: number
  total_size: number
  num_files: number
  timestamp: number
  anidb_aid: number
  anidb_eid: number
}
