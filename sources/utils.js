/**
 * Helper to fetch URLs with fallback CORS proxies if direct request fails or gets 429/403.
 * @param {string} targetUrl
 * @returns {Promise<Response>}
 */
export async function fetchWithProxy(targetUrl) {
  // Try direct fetch first
  try {
    const res = await fetch(targetUrl)
    if (res.ok) return res
  } catch (err) {
    // ignore and try proxies
  }

  // Fallback 1: AllOrigins raw proxy
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
    const res = await fetch(proxyUrl)
    if (res.ok) return res
  } catch (err) {
    // ignore
  }

  // Fallback 2: CorsProxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
    const res = await fetch(proxyUrl)
    if (res.ok) return res
  } catch (err) {
    // ignore
  }

  // Fallback 3: Try Vercel Torrent API Mirror if Nyaa query
  if (targetUrl.includes('nyaa.si')) {
    try {
      const q = new URL(targetUrl).searchParams.get('q') || ''
      const res = await fetch(`https://torrent-search-api-livid.vercel.app/api/nyaasi/${encodeURIComponent(q)}`)
      if (res.ok) return res
    } catch (err) {
      // ignore
    }
  }

  throw new Error(`Failed to fetch ${targetUrl} via all direct & proxy fallbacks.`)
}

export function convertSizeToBytes(sizeStr) {
  if (!sizeStr) return 0
  const match = sizeStr.trim().match(/^([\d.]+)\s*([KMGTP]?i?B?)$/i)
  if (!match) return 0
  const num = parseFloat(match[1])
  const unit = match[2].toUpperCase()

  if (unit.startsWith('G')) return Math.round(num * 1024 * 1024 * 1024)
  if (unit.startsWith('M')) return Math.round(num * 1024 * 1024)
  if (unit.startsWith('K')) return Math.round(num * 1024)
  if (unit.startsWith('T')) return Math.round(num * 1024 * 1024 * 1024 * 1024)
  return Math.round(num)
}

export function parseNyaaFeed(xmlText) {
  const results = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const item = match[1]

    const title = getTag(item, 'title')
    const link = getTag(item, 'link')
    const pubDate = getTag(item, 'pubDate')
    const seeders = parseInt(getTag(item, 'nyaa:seeders') || '0', 10)
    const leechers = parseInt(getTag(item, 'nyaa:leechers') || '0', 10)
    const downloads = parseInt(getTag(item, 'nyaa:downloads') || '0', 10)
    const infoHash = getTag(item, 'nyaa:infoHash')
    const sizeStr = getTag(item, 'nyaa:size')

    const size = convertSizeToBytes(sizeStr)
    const hash = infoHash || (link && link.match(/([a-fA-F0-9]{40})/)?.[1]) || ''

    results.push({
      title: title || 'Untitled',
      link: link || (hash ? `magnet:?xt=urn:btih:${hash}` : ''),
      hash,
      seeders,
      leechers,
      downloads,
      size,
      date: pubDate ? new Date(pubDate) : new Date(),
      accuracy: 'medium'
    })
  }

  return results
}

function getTag(xmlStr, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i')
  const m = xmlStr.match(regex)
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : ''
}
