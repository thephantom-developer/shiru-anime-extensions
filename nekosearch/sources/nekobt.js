import AbstractSource from './abstract.js'

export default new class NekoBT extends AbstractSource {
  url = 'https://api.nekobt.com/v1/search'

  /** @type {import('../../index.d.ts').SearchFunction} */
  async single({ titles, episode }) {
    if (!titles?.length) return []

    const q = episode != null ? `${titles[0]} ${episode}` : titles[0]
    const params = new URLSearchParams({
      query: q,
      category: 'anime'
    })

    try {
      const res = await fetch(`${this.url}?${params}`)
      if (!res.ok) return []

      const data = await res.json()
      const results = data?.torrents || data?.results || []

      return results.map(item => ({
        title: item.title || item.name || 'Untitled',
        link: item.magnet || (item.hash ? `magnet:?xt=urn:btih:${item.hash}` : item.link),
        hash: item.hash || item.info_hash || '',
        seeders: item.seeders || 0,
        leechers: item.leechers || 0,
        downloads: item.downloads || 0,
        size: item.size || 0,
        date: item.created_at ? new Date(item.created_at) : new Date(),
        accuracy: 'high'
      }))
    } catch {
      return []
    }
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async batch(opts) {
    const results = await this.single(opts)
    return results.map(r => ({ ...r, type: 'batch' }))
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async movie(opts) {
    return this.single(opts)
  }

  async validate() {
    try {
      const res = await fetch(`${this.url}?query=test`)
      return res.ok
    } catch {
      return false
    }
  }
}()
