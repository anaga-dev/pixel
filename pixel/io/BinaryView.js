import Endianness from './Endianness.js'

/**
 * Binary view.
 *
 * This class allows positioning into a DataView
 * and make movements in the file.
 * A `BinaryReader` or a `BinaryWriter` is required
 * in order to make read or write operations.
 */
export default class BinaryView {
  #dataView

  /**
   * Posición
   *
   * @type {number}
   */
  #position = 0

  /**
   * Endianness
   *
   * @type {Endianness}
   */
  #endianness = Endianness.BIG

  /**
   * Constructor
   *
   * @param {DataView} dataView
   * @param {number} [position=0]
   * @param {Endianness} [endianness=Endianness.BIG]
   */
  constructor(dataView, position = 0, endianness = Endianness.BIG) {
    if (!(dataView instanceof DataView)) {
      throw new TypeError('DataView is not an instance of DataView')
    }

    if (!Number.isInteger(position)) {
      throw new TypeError('Position is not an integer')
    }

    this.#dataView = dataView
    this.#position = position
    this.#endianness = endianness
  }

  /**
   * @type {DataView}
   */
  get dataView() {
    return this.#dataView
  }

  /**
   * @type {number}
   */
  get position() {
    return this.#position
  }

  set position(newPosition) {
    if (newPosition < 0 || newPosition >= this.#dataView.byteLength) {
      throw new RangeError('Position out of range')
    }
    this.#position = newPosition
  }

  /**
   * @type {Endianness}
   */
  get endianness() {
    return this.#endianness
  }

  /**
   * Rewinds the writing head position.
   *
   * @param {number} [bytes] Number of bytes to be rewinded. If not specified goes back to the top.
   * @returns {number} New position
   */
  rewind(bytes) {
    if (bytes === undefined) {
      this.#position = 0
    } else {
      const newPosition = this.#position - bytes
      if (newPosition < 0 || newPosition >= this.#dataView.byteLength) {
        throw new RangeError('Position out of range')
      }
      this.#position = newPosition
    }
    return this.#position
  }

  /**
   * Skips a certain number of bytes
   *
   * @param {number} bytes Number of bytes to skip
   * @returns {number} New position
   */
  skip(bytes) {
    if (!Number.isInteger(bytes)) {
      throw new TypeError('Bytes is not an integer')
    }
    const newPosition = this.#position + bytes
    if (newPosition < 0 || newPosition >= this.#dataView.byteLength) {
      throw new RangeError('Position out of range')
    }
    this.#position = newPosition
    return this.#position
  }
}
