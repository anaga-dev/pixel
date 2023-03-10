import Endianness from './Endianness';

/**
 * Vista binaria.
 *
 * Esta clase nos permite posicionarnos dentro de un DataView
 * y realizar movimientos en el fichero. Necesitarás utilizar
 * un `BinaryReader` o un `BinaryWriter` para poder leer o
 * escribir de él.
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
   * Rebobina la posición del "cabezal" de escritura.
   *
   * @param {number} [bytes] Número de bytes que rebobinar. Si no se especifica vuelve al principio.
   * @returns {number} La nueva posición
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
   * Salta una cantidad determinada de bytes.
   *
   * @param {number} bytes Número de bytes que saltar
   * @returns {number} La nueva posición
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
