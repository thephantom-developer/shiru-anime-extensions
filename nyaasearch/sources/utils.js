export function zeroPad(v, l) {
    return v.toString().padStart(l, '0');
}

export function convertSizeToBytes(sizeStr) {
    const units = {
        'Bytes': 1,
        'KiB': 1024,
        'MiB': 1024 ** 2,
        'GiB': 1024 ** 3,
        'TiB': 1024 ** 4
    };
    const [val, unit] = sizeStr.trim().split(' ');
    const multiplier = units[unit] || 1;
    return parseFloat(val) * multiplier;
}

export function episodePatterns(episode) {
    return [
        ` ${zeroPad(episode, 2)} `,
        `-${zeroPad(episode, 2)}`,
        `E${zeroPad(episode, 2)}`,
        `Ep${zeroPad(episode, 2)}`,
        `Episode ${zeroPad(episode, 2)}`
    ];
}

export function batchPatterns(episodeCount) {
    return [
        ` 01-${zeroPad(episodeCount, 2)} `,
        `Batch`,
        `Complete`
    ];
}

export function decodeEntry(text) {
    return text.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'")
               .replace(/&apos;/g, "'");
}

export function createNyaaItem(tracker, itemXml) {
    const item = {};
    const tags = ['title', 'link', 'nyaa:seeders', 'nyaa:leechers', 'nyaa:downloads', 'nyaa:size', 'nyaa:infoHash', 'nyaa:trusted', 'nyaa:remake', 'pubDate'];
    
    tags.forEach(tag => {
        const match = itemXml.match(new RegExp(`<${tag}><!\\[CDATA\\[(.*?)\\]\\]></${tag}>`));
        if (match) {
            item[tag] = match[1];
        } else {
            const match2 = itemXml.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
            if (match2) {
                item[tag] = decodeEntry(match2[1]);
            }
        }
    });
    return item;
}

export function parseNyaaFeed(tracker, xml) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
        items.push(createNyaaItem(tracker, match[1]));
    }
    return items;
}
