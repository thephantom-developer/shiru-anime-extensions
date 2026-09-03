import AbstractSource from './abstract.js'

export default new class AnimeTosho extends AbstractSource {
  url = atob('aHR0cHM6Ly9mZWVkLmFuaW1ldG9zaG8ub3JnL2pzb24=')

  #map(items) {
    return items.map(item => ({
      title: item.title || '',
      link: item.magnet_uri || item.torrent_url || item.link || '',
      hash: item.info_hash || '',
      seeders: Number(item.seeders) || 0,
      leechers: Number(item.leechers) || 0,
      downloads: 0,
      size: Number(item.total_size) || 0,
      accuracy: 'high',
      type: item.num_files > 1 ? 'batch' : undefined,
      date: item.timestamp ? new Date(item.timestamp * 1000) : undefined
    }))
  }

  async single({ anidbEid }) {
    if (!anidbEid) return []
    const res = await fetch(`${this.url}?eid=${anidbEid}`)
    if (!res?.ok) return []
    const items = await res.json()
    if (!Array.isArray(items)) return []
    return this.#map(items)
  }

  async batch({ anidbAid }) {
    if (!anidbAid) return []
    const res = await fetch(`${this.url}?aid=${anidbAid}&only_batch=1`)
    if (!res?.ok) return []
    const items = await res.json()
    if (!Array.isArray(items)) return []
    return this.#map(items)
  }

  async movie({ anidbAid }) {
    if (!anidbAid) return []
    const res = await fetch(`${this.url}?aid=${anidbAid}`)
    if (!res?.ok) return []
    const items = await res.json()
    if (!Array.isArray(items)) return []
    return this.#map(items)
  }

  async validate() { return (await fetch(this.url))?.ok }
}()
