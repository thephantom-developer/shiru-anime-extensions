import AbstractSource from './abstract.js'

export default new class TsukiHime extends AbstractSource {
  url = 'https://api.tsukihime.org/v1'

  async single({ anilistId, anidbAid, media, episode }) {
    try {
      const params = new URLSearchParams()
      if (anilistId) params.append('anilist_id', anilistId.toString())
      if (anidbAid) params.append('anidb_id', anidbAid.toString())
      if (media?.idMal) params.append('mal_id', media.idMal.toString())

      if (!params.toString()) return []

      const mapRes = await fetch(`${this.url}/mappings?${params}`)
      if (!mapRes.ok) return []
      const mapData = await mapRes.json()
      const tsukiId = mapData?.tsuki_id || mapData?.id
      if (!tsukiId) return []

      const url = episode != null ? `${this.url}/animes/${tsukiId}/episodes/${episode}?limit=100` : `${this.url}/animes/${tsukiId}?limit=100`
      const res = await fetch(url)
      if (!res.ok) return []

      const data = await res.json()
      if (!data?.results?.length) return []

      return data.results.map(item => ({
        title: item.name + (item.audiolangs?.length > 1 && !/DUAL/i.test(item.name) ? ' Dual Audio' : ''),
        link: `magnet:?xt=urn:btih:${item.btih}&dn=${encodeURIComponent(item.name)}`,
        hash: item.btih,
        seeders: item.seeders || 0,
        leechers: item.leechers || 0,
        downloads: item.downloads || 0,
        size: item.totalsize || item.size || 0,
        sub_lang: item.sublangs || [],
        audio_lang: item.audiolangs || [],
        dual_audio: (item.audiolangs || []).length > 1,
        accuracy: 'high',
        date: item.source_date ? new Date(item.source_date * 1000) : new Date()
      }))
    } catch {
      return []
    }
  }

  async batch(opts) {
    return this.single(opts)
  }

  async movie(opts) {
    return this.single(opts)
  }

  async validate() {
    return true
  }
}()
