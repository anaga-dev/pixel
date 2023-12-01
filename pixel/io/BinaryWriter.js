import BinaryView from './BinaryView'
import BinaryTypeData from './BinaryTypeData'
import Endianness from './Endianness'

export default class BinaryWriter extends BinaryView {
  /**
   * Gets a BinaryWriter
   *
   * @param {number} byteLength
   * @returns {BinaryWriter}
   */
  static fromByteLength(byteLength) {
    return new BinaryWriter(new DataView(new ArrayBuffer(byteLength)))
  }

  /**
   * Writes a value in the current position of the DataView.
   *
   * @param {BinaryType} type
   * @param {number} value
   * @param {Endianness} [endianness]
   * @returns {BinaryWriter}
   */
  write(type, value, endianness) {
    const [size, , , methodName] = BinaryTypeData[type]
    const method = this.dataView[methodName]
    method(this.position, value, endianness ?? this.endianness)
    this.position += size
    return this
  }

  /**
   * Writes a buffer in the current position of the DataView.
   *
   * @param {ArrayBufferView} buffer
   * @param {number} [bytes]
   * @returns {BinaryWriter}
   */
  writeBuffer(buffer, bytes) {
    const destinationBuffer = new Uint8Array(this.dataView.buffer)
    if (typeof bytes === 'number' && Number.isInteger(bytes)) {
      destinationBuffer.fill(0, this.position, this.position + bytes)
    }
    destinationBuffer.set(buffer, this.position)
    if (typeof bytes === 'number' && Number.isInteger(bytes)) {
      this.position += bytes
    } else {
      this.position += buffer.byteLength
    }
    return this
  }

  /**
   * Writes a string in the current position of the DataView.
   *
   * @param {string} value
   * @param {*} options
   * @returns {BinaryWriter}
   */
  writeString(value, { encoding = 'utf8', bytes, end = 0x00 } = {}) {
    if (typeof value !== 'string') {
      throw new Error(`Invalid string "${value}"`)
    }
    const encoder = new TextEncoder(encoding)
    const buffer = encoder.encode(value)
    return this.writeBuffer(buffer, bytes)
  }

  /**
   *
   *
   * @param {BinaryType} type
   * @param {number} value
   * @param {Endianness} [endianness]
   */
  writeType(type, value, endianness) {

  }
}
