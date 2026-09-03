import AbstractSource from './abstract.js'
import { parseNyaaFeed } from './utils.js'

export default new class Sukebei extends AbstractSource {
  url = 'https://sukebei.nyaa.si/?page=rss'

  async #fetchFeed(queryUrl) {
    const res = await fetch(queryUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    const xml = await res.text()
    return parseNyaaFeed(xml)
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async single({ titles }) {
    if (!titles?.length) return []
    const q = encodeURIComponent(titles.join(' '))
    return this.#fetchFeed(`${this.url}&c=1_1&f=0&s=seeders&o=desc&q=${q}`)
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async batch({ titles }) {
    if (!titles?.length) return []
    const q = encodeURIComponent(`${titles.join(' ')} Batch`)
    const results = await this.#fetchFeed(`${this.url}&c=1_1&f=0&s=seeders&o=desc&q=${q}`)
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
