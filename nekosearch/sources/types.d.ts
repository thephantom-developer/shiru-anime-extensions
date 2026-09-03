export interface nekoBT {
  error?: boolean
  data?: { results?: nekoBTTorrent[] }
}

export interface nekoBTTorrent {
  title: string | null
  auto_title: string
  infohash: string
  magnet: string
  seeders: number
  leechers: number
  completed: number
  filesize: number
  batch: boolean
  sub_lang: string | null
  fsub_lang: string | null
  audio_lang: string | null
  media_episode_ids: string[] | null
  uploaded_at: string
}
