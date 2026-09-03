/**
 * Parse AniDex RSS feed XML into structured items.
 */
export function parseAnidexFeed(xml) {
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  const items = []
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    items.push(createAnidexItem(match[1]))
  }
  return items
}

function decodeEntry(text) {
  return text
    .replace(/&#(\d+);/g, (m, dec) => String.fromCharCode(dec))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
}

function createAnidexItem(itemXml) {
  const getTag = (tag) => {
    const match = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(itemXml)
    return match ? decodeEntry(match[1].trim()) : ''
  }
  const getAttribute = (tag, attr) => {
    const match = new RegExp(`<${tag}[^>]*?${attr}="([^"]*?)"`, 'i').exec(itemXml)
    return match ? decodeEntry(match[1]) : ''
  }

  const title = getTag('title') || '?'
  const link = getTag('link') || ''
  const enclosure = getAttribute('enclosure', 'url') || ''
  const infoHash = getTag('infoHash') || ''
  const seeders = parseInt(getTag('seeders')) || 0
  const leechers = parseInt(getTag('leechers')) || 0
  const size = parseInt(getTag('size')) || 0

  return {
    title,
    link: enclosure || link,
    hash: infoHash,
    seeders,
    leechers,
    size,
    pubDate: getTag('pubDate') || ''
  }
}
