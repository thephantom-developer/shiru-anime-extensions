/**
 * AbstractSource base class for Shiru Extension implementations.
 */
export default class AbstractSource {
  /**
   * Query results for a single episode.
   * @param {import('../../index.d.ts').TorrentQuery} options
   * @returns {Promise<import('../../index.d.ts').TorrentResult[]>}
   */
  async single(options) {
    throw new Error('Source does not implement single()')
  }

  /**
   * Query results for a batch/season.
   * @param {import('../../index.d.ts').TorrentQuery} options
   * @returns {Promise<import('../../index.d.ts').TorrentResult[]>}
   */
  async batch(options) {
    throw new Error('Source does not implement batch()')
  }

  /**
   * Query results for a movie.
   * @param {import('../../index.d.ts').TorrentQuery} options
   * @returns {Promise<import('../../index.d.ts').TorrentResult[]>}
   */
  async movie(options) {
    throw new Error('Source does not implement movie()')
  }

  /**
   * Validate that the source API / endpoint is reachable.
   * @returns {Promise<boolean>}
   */
  async validate() {
    return true
  }
}
