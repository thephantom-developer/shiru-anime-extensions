/**
 * Wrapper around fetch with timeout support.
 * @param {string} url
 * @param {RequestInit} [opts]
 * @returns {Promise<Response>}
 */
export async function _fetch(url, opts = {}) {
  return fetch(url, { ...opts, signal: AbortSignal.timeout?.(15000) })
}

/**
 * Resolves a TsukiHime internal ID from anilistId, anidbAid, or malId.
 * @param {string} baseUrl
 * @param {number} [anilistId]
 * @param {number} [anidbAid]
 * @param {number} [malId]
 * @returns {Promise<string|null>}
 */
export async function getTsukiId(baseUrl, anilistId, anidbAid, malId) {
  const ids = [
    anilistId ? `anilist=${anilistId}` : null,
    anidbAid ? `anidb=${anidbAid}` : null,
    malId ? `mal=${malId}` : null
  ].filter(Boolean)

  for (const param of ids) {
    try {
      const res = await _fetch(`${baseUrl}/mapping?${param}`)
      if (res.ok) {
        const data = await res.json()
        if (data?.id) return data.id
      }
    } catch {}
  }
  return null
}
