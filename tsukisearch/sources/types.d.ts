export interface TsukiResponse {
  error?: string
  results?: TsukiTorrent[]
}

export interface TsukiTorrent {
  name: string
  btih: string
  totalsize: number
  audiolangs: string[]
  sublangs: string[]
  filecount: number
  source_date: number
}
