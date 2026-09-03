import AbstractSource from './abstract.js'
import { parseTokyoFeed } from './utils.js'

export default new class TokyoToshokan extends AbstractSource {
  url = atob('aHR0cHM6Ly93d3cudG9reW90b3Nob2thbi5vcmcvcnNzLnBocA==')
  // https://www.tokyotoshokan.org/rss.php

  async #query(titles, { resolution, exclusions } = {}) {
    const searchTerm = titles[0] || ''
    if (!searchTerm) return []
    const url = `${this.url}?terms=${encodeURIComponent(searchTerm)}&type=1`
    const res = await fetch(url)
    if (!res?.ok) return []
    const xml = await res.text()
    const items = parseTokyoFeed(xml)
    return items.filter(item => {
      if (!item.title || !item.link) return false
      const title = item.title.toLowerCase()
      if (exclusions?.some(e => title.includes(e.toLowerCase()))) return false
      return true
    }).map(item => ({
      title: item.title,
      link: item.link,
      hash: item.hash || '',
      seeders: 0,
      leechers: 0,
      downloads: 0,
      size: 0,
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
