import AbstractSource from './abstract.js'
import { fetchWithProxy, parseNyaaFeed } from './utils.js'

export default new class Sukebei extends AbstractSource {
  url = 'https://sukebei.nyaa.si/?page=rss'

  async single({ titles, episode }) {
    if (!titles?.length) return []
    const q = episode != null ? `${titles[0]} ${episode}` : titles[0]
    const fullUrl = `${this.url}&c=1_1&f=0&s=seeders&o=desc&q=${encodeURIComponent(q)}`
    try {
      const res = await fetchWithProxy(fullUrl)
      const xml = await res.text()
      return parseNyaaFeed(xml)
    } catch {
      return []
    }
  }

  async batch({ titles }) {
    return this.single({ titles })
  }

  async movie({ titles }) {
    return this.single({ titles })
  }

  async validate() {
    return true
  }
}()
