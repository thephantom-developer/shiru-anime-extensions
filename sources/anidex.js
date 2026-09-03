import AbstractSource from './abstract.js'
import { fetchWithProxy, parseNyaaFeed } from './utils.js'

export default new class AniDex extends AbstractSource {
  url = 'https://anidex.info/rss'

  async single({ titles, episode }) {
    if (!titles?.length) return []
    try {
      const q = episode != null ? `${titles[0]} ${episode}` : titles[0]
      const fullUrl = `${this.url}?q=${encodeURIComponent(q)}&id=1`
      const res = await fetchWithProxy(fullUrl)
      const xml = await res.text()
      return parseNyaaFeed(xml)
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
