import AbstractSource from './abstract.js'
import { parseNyaaFeed } from '../../nyaasearch/sources/utils.js'

export default new class AniDex extends AbstractSource {
  url = 'https://anidex.info/rss'

  async #fetchFeed(queryUrl) {
    const res = await fetch(queryUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    const xml = await res.text()
    return parseNyaaFeed(xml)
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async single({ titles, episode }) {
    if (!titles?.length) return []
    const q = episode != null ? `${titles[0]} ${episode}` : titles[0]
    const params = new URLSearchParams({
      q: q,
      id: '1' // Anime subbed category
    })
    return this.#fetchFeed(`${this.url}?${params}`)
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async batch({ titles }) {
    if (!titles?.length) return []
    const params = new URLSearchParams({
      q: `${titles[0]} Batch`,
      id: '1'
    })
    const results = await this.#fetchFeed(`${this.url}?${params}`)
    return results.map(r => ({ ...r, type: 'batch' }))
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async movie({ titles }) {
    return this.single({ titles })
  }

  async validate() {
    try {
      const res = await fetch(this.url)
      return res.ok
    } catch {
      return false
    }
  }
}()
