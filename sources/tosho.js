import AbstractSource from './abstract.js'

export default new class AnimeTosho extends AbstractSource {
  url = 'https://feed.animetosho.org/json'

  async single({ anidbAid, anidbEid, titles, episode }) {
    try {
      const params = new URLSearchParams({
        order: 'seeders-desc'
      })

      if (anidbAid) params.append('aid', anidbAid.toString())
      if (anidbEid) params.append('eid', anidbEid.toString())
      if (!anidbAid && titles?.length) {
        const q = episode != null ? `${titles[0]} ${episode}` : titles[0]
        params.append('q', q)
      }

      const res = await fetch(`${this.url}?${params}`)
      if (!res.ok) return []

      const items = await res.json()
      if (!Array.isArray(items)) return []

      return items.map(item => ({
        title: item.title || item.name || 'Untitled',
        link: item.magnet_url || (item.info_hash ? `magnet:?xt=urn:btih:${item.info_hash}` : item.link),
        hash: item.info_hash || '',
        seeders: item.seeders || 0,
        leechers: item.leechers || 0,
        downloads: item.torrent_download_count || 0,
        size: item.total_size || item.size || 0,
        date: item.timestamp ? new Date(item.timestamp * 1000) : new Date(),
        accuracy: item.aid ? 'high' : 'medium'
      }))
    } catch {
      return []
    }
  }

  async batch(opts) {
    const results = await this.single(opts)
    return results.map(r => ({ ...r, type: 'batch' }))
  }

  async movie(opts) {
    return this.single(opts)
  }

  async validate() {
    return true
  }
}()
