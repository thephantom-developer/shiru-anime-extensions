import AbstractSource from './abstract.js'

const QUALITIES = ['2160', '1080', '720', '540', '480']

export default new class TsukiHime extends AbstractSource {
  url = 'https://api.tsukihime.org/v1'

  async #getTsukiId(anilistId, anidbAid, idMal) {
    const params = new URLSearchParams()
    if (anilistId) params.append('anilist_id', anilistId.toString())
    if (anidbAid) params.append('anidb_id', anidbAid.toString())
    if (idMal) params.append('mal_id', idMal.toString())

    if (!params.toString()) return null

    try {
      const res = await fetch(`${this.url}/mappings?${params}`)
      if (!res.ok) return null
      const data = await res.json()
      return data?.tsuki_id || data?.id || null
    } catch {
      return null
    }
  }

  #mapResults(results, batch = false) {
    return results.map(item => ({
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
      accuracy: batch ? 'medium' : 'high',
      type: batch || (item.filecount > 1 && /BATCH/i.test(item.name)) ? 'batch' : undefined,
      date: item.source_date ? new Date(item.source_date * 1000) : new Date()
    }))
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async single({ anilistId, anidbAid, media, episode, resolution, exclusions }) {
    const tsukiId = await this.#getTsukiId(anilistId, anidbAid, media?.idMal)
    if (!tsukiId) return []

    const url = episode != null ? `${this.url}/animes/${tsukiId}/episodes/${episode}?limit=100` : `${this.url}/animes/${tsukiId}?limit=100`
    const res = await fetch(url)
    if (!res.ok) return []

    const data = await res.json()
    if (!data?.results?.length) return []

    let mapped = this.#mapResults(data.results, false)
    if (resolution) {
      mapped = mapped.filter(r => !QUALITIES.filter(q => q !== resolution).some(q => r.title.includes(q)))
    }
    if (exclusions?.length) {
      mapped = mapped.filter(r => !exclusions.some(ex => r.title.toLowerCase().includes(ex.toLowerCase())))
    }
    return mapped
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async batch({ anilistId, anidbAid, media, resolution, exclusions }) {
    const tsukiId = await this.#getTsukiId(anilistId, anidbAid, media?.idMal)
    if (!tsukiId) return []

    const res = await fetch(`${this.url}/animes/${tsukiId}?limit=100`)
    if (!res.ok) return []

    const data = await res.json()
    if (!data?.results?.length) return []

    const batchResults = data.results.filter(r => r.filecount > 1)
    return this.#mapResults(batchResults, true)
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async movie({ anilistId, anidbAid, media, resolution, exclusions }) {
    return this.single({ anilistId, anidbAid, media, resolution, exclusions })
  }

  async validate() {
    try {
      const res = await fetch(`${this.url}/stats`)
      return res.ok
    } catch {
      return false
    }
  }
}()
