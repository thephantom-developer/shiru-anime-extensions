import AbstractSource from './abstract.js'
import { fetchWithProxy, parseNyaaFeed } from './utils.js'

export default new class Nyaa extends AbstractSource {
  url = 'https://nyaa.si/?page=rss'

  async #fetchQuery(q) {
    const fullUrl = `${this.url}&c=1_2&f=0&s=seeders&o=desc&q=${encodeURIComponent(q)}`
    try {
      const res = await fetchWithProxy(fullUrl)
      const text = await res.text()

      // Handle JSON response from Vercel API fallback if used
      if (text.startsWith('[') || text.startsWith('{')) {
        const json = JSON.parse(text)
        if (Array.isArray(json)) {
          return json.map(item => ({
            title: item.Name || item.title || 'Untitled',
            link: item.Magnet || item.link || (item.hash ? `magnet:?xt=urn:btih:${item.hash}` : ''),
            hash: item.Magnet?.match(/btih:([A-Fa-f0-9]+)/i)?.[1] || item.hash || '',
            seeders: Number(item.Seeders || item.seeders || 0),
            leechers: Number(item.Leechers || item.leechers || 0),
            downloads: Number(item.Downloads || item.downloads || 0),
            size: Number(item.size || 0),
            date: item.DateUploaded ? new Date(item.DateUploaded) : new Date(),
            accuracy: 'medium'
          }))
        }
      }

      return parseNyaaFeed(text)
    } catch {
      return []
    }
  }

  async single({ titles, episode }) {
    if (!titles?.length) return []
    const q = episode != null ? `${titles[0]} ${episode.toString().padStart(2, '0')}` : titles[0]
    return this.#fetchQuery(q)
  }

  async batch({ titles }) {
    if (!titles?.length) return []
    const q = `${titles[0]} Batch`
    const results = await this.#fetchQuery(q)
    return results.map(r => ({ ...r, type: 'batch' }))
  }

  async movie({ titles }) {
    if (!titles?.length) return []
    return this.#fetchQuery(titles[0])
  }

  async validate() {
    return true
  }
}()
