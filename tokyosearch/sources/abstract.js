export default class AbstractSource {
  single (options) { throw new Error('Source does not implement method #single()') }
  batch (options) { throw new Error('Source does not implement method #batch()') }
  movie (options) { throw new Error('Source does not implement method #movie()') }
  validate () { throw new Error('Source does not implement method #validate()') }
}
