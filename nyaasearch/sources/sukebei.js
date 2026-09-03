import AbstractSource from './abstract.js'
import { parseNyaaFeed, episodePatterns, batchPatterns, convertSizeToBytes } from './utils.js'

const QUALITIES = ['2160', '1080', '720', '540', '480']

export default new class Sukebei extends AbstractSource {
    url = atob('aHR0cHM6Ly9zdWtlYmVpLm55YWEuc2kvP3BhZ2U9cnNz')
    tracker = encodeURIComponent(atob('aHR0cDovL3N1a2ViZWkudHJhY2tlci53Zjo4ODg4L2Fubm91bmNl'))

    #buildQuery(titles, { resolution, exclusions, episode, episodeCount }, batch = false) {
        const queryParts = [
            `(${titles.join(')|(')})`,
            episodeCount > 1 ? batch ? batchPatterns(episodeCount).join("|") : episodePatterns(episode).join('|') : '',
            resolution ? `-(${QUALITIES.filter(q => q !== resolution).join('|')})` : '',
            exclusions?.length ? `-(${exclusions.join('|')})` : ''
        ]
        return `&c=1_1&f=0&s=seeders&o=desc&q=${queryParts.join('')}`
    }

    map (nodes, batch = false) {
        return nodes.map(item => {
            return {
                title: item.title,
                link: item.link,
                hash: item['nyaa:infoHash'],
                seeders: Number(item['nyaa:seeders']),
                leechers: Number(item['nyaa:leechers']),
                downloads: Number(item['nyaa:downloads']),
                size: convertSizeToBytes(item['nyaa:size']),
                accuracy: (item['nyaa:trusted'] === 'Yes' || item['nyaa:remake'] === 'Yes') ? 'medium' : 'low',
                type: batch ? 'batch' : undefined,
                date: item.pubDate ? new Date(item.pubDate) : undefined
            }
        })
    }

    async #query(titles, { resolution, exclusions, episode, episodeCount }, batch = false) {
        const query = this.#buildQuery(titles, { resolution, exclusions, episode, episodeCount }, batch)
        const res = await fetch(this.url + query)
        if (res?.ok) {
            const xml = await res.text()
            const data = [...parseNyaaFeed(this.tracker, xml)]
            return this.map(data, batch)
        }
        return []
    }

    async single ({ anilistId, episode, episodeCount, titles, exclusions, resolution }) {
        return this.#query(titles, { resolution, exclusions, episode, episodeCount })
    }

    async batch ({ anilistId, episode, episodeCount, titles, exclusions, resolution }) {
        return this.#query(titles, { resolution, exclusions, episode, episodeCount }, true)
    }

    async movie (opts) {
        return []
    }

    async validate () {
        return (await fetch(this.url))?.ok
    }
}()
