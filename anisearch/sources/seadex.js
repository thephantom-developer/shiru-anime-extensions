import AbstractSource from './abstract.js'

export default new class SeaDex extends AbstractSource {
  url = 'https://releases.moe/api/collections/entries/records'

  /** @type {import('../../index.d.ts').SearchFunction} */
  async single({ anilistId, titles, episodeCount }) {
    if (!anilistId) throw new Error('No anilistId provided')
    if (!titles?.length) throw new Error('No titles provided')

    const query = new URLSearchParams({
      page: '1',
      perPage: '1',
      filter: `alID="${anilistId}"`,
      skipTotal: '1',
      expand: 'trs'
    })

    const res = await fetch(`${this.url}?${query}`)
    if (!res?.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)

    const { items } = await res.json()
    const trs = items?.[0]?.expand?.trs

    if (!trs?.length || !Array.isArray(trs)) return []

    return trs
      .filter(({ infoHash, files }) => infoHash && infoHash !== '<redacted>' && !(episodeCount > 1 && files?.length === 1))
      .map(({ infoHash, files, releaseGroup, dualAudio, isBest, created }) => ({
        hash: infoHash,
        link: `magnet:?xt=urn:btih:${infoHash}`,
        title: files?.length === 1 ? files[0].name : `[${releaseGroup || 'SeaDex'}] ${titles[0]}${dualAudio ? ' Dual Audio' : ''}`,
        size: files?.reduce((total, { length }) => total + (length || 0), 0) || 0,
        type: isBest ? 'best' : 'alt',
        date: created ? new Date(created) : new Date(),
        seeders: 0,
        leechers: 0,
        downloads: 0,
        accuracy: 'high'
      }))
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async batch(opts) {
    return this.single(opts)
  }

  /** @type {import('../../index.d.ts').SearchFunction} */
  async movie(opts) {
    return this.single(opts)
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
