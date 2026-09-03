import AbstractSource from './abstract.js'
import { parseAnidexFeed } from './utils.js'

export default new class AniDex extends AbstractSource {
  url = atob('aHR0cHM6Ly9hbmlkZXguaW5mbw==')
  // https://anidex.info

  async #query(titles, { resolution, exclusions } = {}) {
    const searchTerm = titles[0] || ''
    if (!searchTerm) return []
    // AniDex RSS: /rss/?q=SEARCH&id=1 (category 1 = anime)
    const url = `${this.url}/rss/?q=${encodeURIComponent(searchTerm)}&id=1`
    const res = await fetch(url)
    if (!res?.ok) return []
    const xml = await res.text()
    const items = parseAnidexFeed(xml)
    return items.filter(item => {
      if (!item.title || !item.link) return false
      const title = item.title.toLowerCase()
      if (exclusions?.some(e => title.includes(e.toLowerCase()))) return false
      return true
    }).map(item => ({
      title: item.title,
      link: item.link,
      hash: item.hash || '',
      seeders: item.seeders || 0,
      leechers: item.leechers || 0,
      downloads: 0,
      size: item.size || 0,
      accuracy: 'low',
      date: item.pubDate ? new Date(item.pubDate) : undefined
    }))
  }

  async single({ titles, resolution, exclusions }) {
    if (!titles?.length) return []
    return this.#query(titles, { resolution, exclusions })
  }

  async batch({ titles, resolution, exclusions }) {
    if (!titles?.length) return []
    return this.#query(titles, { resolution, exclusions })
  }

  async movie({ titles, resolution, exclusions }) {
    if (!titles?.length) return []
    return this.#query(titles, { resolution, exclusions })
  }

  async validate() {
    return (await fetch(this.url))?.ok
  }
}()
