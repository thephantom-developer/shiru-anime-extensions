import AbstractSource from './abstract.js'
import { parseNyaaFeed, episodePatterns, batchPatterns } from './utils.js'

const QUALITIES = ['2160', '1080', '720', '540', '480']

export default new class Nyaa extends AbstractSource {
  url = 'https://nyaa.si/?page=rss'
  tracker = 'http://nyaa.tracker.wf:7777/announce'

  #buildQuery(titles, { resolution, exclusions, episode, episodeCount }, batch = false) {
    const queryParts = [
      `(${titles.join(')|(')})`,
      episodeCount > 1 ? (batch ? batchPatterns(episodeCount).join('|') : episodePatterns(episode).join('|')) : '',
      resolution ? `-(${QUALITIES.filter(q => q !== resolution).join('|')})` : '',
      exclusions?.length ? `-(${exclusions.join('|')})` : ''
    ]
    return `&c=1_2&f=0&s=seeders&o=desc&q=${encodeURIComponent(queryParts.filter(Boolean).join(' '))}`
  }

  async #fetchFeed(queryUrl) {
    const res = await fetch(queryUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    const xml = await res.text()
    return parseNyaaFeed(xml)
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async single({ titles, episode, episodeCount, resolution, exclusions }) {
    if (!titles?.length) return []
    const queryStr = this.#buildQuery(titles, { resolution, exclusions, episode, episodeCount }, false)
    return this.#fetchFeed(`${this.url}${queryStr}`)
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async batch({ titles, episodeCount, resolution, exclusions }) {
    if (!titles?.length) return []
    const queryStr = this.#buildQuery(titles, { resolution, exclusions, episodeCount }, true)
    const results = await this.#fetchFeed(`${this.url}${queryStr}`)
    return results.map(r => ({ ...r, type: 'batch' }))
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async movie({ titles, resolution, exclusions }) {
    if (!titles?.length) return []
    const queryStr = `&c=1_2&f=0&s=seeders&o=desc&q=${encodeURIComponent(titles.join(' '))}`
    return this.#fetchFeed(`${this.url}${queryStr}`)
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
