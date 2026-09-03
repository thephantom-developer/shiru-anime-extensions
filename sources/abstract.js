/**
 * Base AbstractSource class for all Shiru extensions.
 */
export default class AbstractSource {
  async single(options) {
    return []
  }

  async batch(options) {
    return []
  }

  async movie(options) {
    return []
  }

  /**
   * Always return true to prevent Shiru app from failing extension loading with 429/403 rate limits.
   * @returns {Promise<boolean>}
   */
  async validate() {
    return true
  }
}
