/**
 * Resolves a nekoBT media ID from TVDB, MVDB, or IMDB IDs.
 * @param {string} baseUrl
 * @param {number} [tvdbAid]
 * @param {number} [mvdbAid]
 * @param {string} [imdbAid]
 * @param {string[]} [titles]
 * @returns {Promise<string|null>}
 */
export async function resolveMediaId(baseUrl, tvdbAid, mvdbAid, imdbAid, titles) {
  if (tvdbAid) {
    try {
      const res = await fetch(`${baseUrl}/mapping?tvdb=${tvdbAid}`)
      if (res.ok) {
        const data = await res.json()
        if (data?.media_id) return data.media_id
      }
    } catch {}
  }
  if (mvdbAid) {
    try {
      const res = await fetch(`${baseUrl}/mapping?mvdb=${mvdbAid}`)
      if (res.ok) {
        const data = await res.json()
        if (data?.media_id) return data.media_id
      }
    } catch {}
  }
  if (imdbAid) {
    try {
      const res = await fetch(`${baseUrl}/mapping?imdb=${imdbAid}`)
      if (res.ok) {
        const data = await res.json()
        if (data?.media_id) return data.media_id
      }
    } catch {}
  }
  return null
}

/**
 * Resolves episode ID from media ID, TVDB episode ID, season, or absolute episode number.
 * @param {string} baseUrl
 * @param {string} mediaId
 * @param {number} [tvdbEid]
 * @param {number} [season]
 * @param {number} [absoluteEpisode]
 * @returns {Promise<object|null>}
 */
export async function resolveEpisodeId(baseUrl, mediaId, tvdbEid, season, absoluteEpisode) {
  try {
    const params = new URLSearchParams({ media_id: mediaId })
    if (tvdbEid) params.set('tvdb_eid', tvdbEid)
    if (season != null) params.set('season', season)
    if (absoluteEpisode != null) params.set('absolute', absoluteEpisode)
    const res = await fetch(`${baseUrl}/episodes/resolve?${params}`)
    if (res.ok) return await res.json()
  } catch {}
  return null
}
