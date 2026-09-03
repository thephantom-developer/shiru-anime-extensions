/**
 * Pattern generators for episode queries.
 * @param {number} episode
 * @returns {string[]}
 */
export function episodePatterns(episode) {
  if (episode == null) return []
  const epStr = episode.toString().padStart(2, '0')
  return [
    `E${epStr}`,
    `E${episode}`,
    ` - ${epStr}`,
    ` - ${episode}`,
    `[${epStr}]`,
    `v2`,
    `v3`
  ]
}

/**
 * Pattern generators for batch queries.
 * @param {number} episodeCount
 * @returns {string[]}
 */
export function batchPatterns(episodeCount) {
  return [
    'Batch',
    'Complete',
    '01~',
    '01-',
    'S01',
    'Season 1'
  ]
}

/**
 * Convert human readable size (e.g. 1.4 GiB or 500 MB) to bytes.
 * @param {string} sizeStr
 * @returns {number}
 */
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

/**
 * Simple XML parser for Nyaa/Sukebei RSS feeds.
 * @param {string} xmlText
 * @returns {import('../../index.d.ts').TorrentResult[]}
 */
export function parseNyaaFeed(xmlText) {
  const results = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const item = match[1]

    const title = getTag(item, 'title')
    const link = getTag(item, 'link')
    const guid = getTag(item, 'guid')
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
