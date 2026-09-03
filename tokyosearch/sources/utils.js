/**
 * Parse a Tokyo Toshokan RSS feed XML into structured items.
 */
export function parseTokyoFeed(xml) {
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  const items = []
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    items.push(createTokyoItem(match[1]))
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

function createTokyoItem(itemXml) {
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
  const magnetMatch = /magnet:\?[^<"\s]+/i.exec(getTag('description') || '')
  const magnet = magnetMatch ? magnetMatch[0] : ''
  const hashMatch = /btih:([a-fA-F0-9]{40})/i.exec(magnet || link || enclosure)

  return {
    title,
    link: magnet || enclosure || link,
    hash: hashMatch ? hashMatch[1] : '',
    pubDate: getTag('pubDate') || ''
  }
}

/**
 * Convert human-readable size to bytes.
 */
export function convertSizeToBytes(size) {
  if (!size || typeof size !== 'string') return 0
  const match = size.match(/^([\d.]+)\s*(TiB|GiB|MiB|KiB|TB|GB|MB|KB|B)$/i)
  if (!match) return 0
  const value = parseFloat(match[1])
  const unit = match[2].toUpperCase()
  const multipliers = { 'TIB': 1099511627776, 'GIB': 1073741824, 'MIB': 1048576, 'KIB': 1024, 'TB': 1000000000000, 'GB': 1000000000, 'MB': 1000000, 'KB': 1000, 'B': 1 }
  return value * (multipliers[unit] || 0)
}
