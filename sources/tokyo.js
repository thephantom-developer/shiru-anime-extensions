import AbstractSource from './abstract.js'
import { fetchWithProxy, parseNyaaFeed } from './utils.js'

export default new class TokyoToshokan extends AbstractSource {
  url = 'https://www.tokyotoshokan.org/rss.php'

  async single({ titles, episode }) {
    if (!titles?.length) return []
    try {
      const q = episode != null ? `${titles[0]} ${episode}` : titles[0]
      const fullUrl = `${this.url}?terms=${encodeURIComponent(q)}&type=1`
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
