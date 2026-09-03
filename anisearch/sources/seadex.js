import AbstractSource from './abstract.js'

export default new class SeaDex extends AbstractSource {
  url = atob('aHR0cHM6Ly9yZWxlYXNlcy5tb2UvYXBpL2NvbGxlY3Rpb25zL2VudHJpZXMvcmVjb3Jkcw==')

  async single({ anilistId, titles, episodeCount }) {
    if (!anilistId) throw new Error('No anilistId provided')
    if (!titles?.length) throw new Error('No titles provided')
    const query = new URLSearchParams({
      page: '1', perPage: '1',
      filter: `alID="${anilistId}"`,
      skipTotal: '1', expand: 'trs'
    })
    const res = await fetch(`${this.url}?${query}`)
    if (!res?.ok) throw new Error(`Failed to query: HTTP ${res?.status} ${res?.statusText}`)
    const { items } = await res.json()
    const trs = items?.[0]?.expand?.trs
    if (!trs?.length || !Array.isArray(trs)) return []
    return trs.filter(({ infoHash, files }) => !(infoHash === '<redacted>' || (episodeCount > 1 && files?.length === 1)))
        .map(({ infoHash, files, releaseGroup, dualAudio, isBest, created }) => ({
          hash: infoHash,
          link: infoHash,
          title: files.length === 1 ? files[0].name : `[${releaseGroup}] ${titles[0]}${dualAudio ? ' Dual Audio' : ''}`,
          size: files.reduce((total, { length }) => total + length, 0),
          type: isBest ? 'best' : 'alt',
          date: new Date(created),
          seeders: 0, leechers: 0, downloads: 0,
          accuracy: 'high'
        }))
  }
  async batch(opts) { return [] }
  async movie(opts) { return [] }
  async validate() { return (await fetch(this.url))?.ok }
}()
