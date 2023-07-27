import BinaryView from './BinaryView'
import BinaryOperation from './BinaryOperation'
import DataViewUtils from './DataViewUtils'

export default class BinaryWriter extends BinaryView {
  /**
   * Obtenemos un BinaryWriter
   *
   * @param {number} byteLength
   * @returns {BinaryWriter}
   */
  static fromByteLength(byteLength) {
    return new BinaryWriter(new DataView(new ArrayBuffer(byteLength)))
  }

  write(type, value, endianness) {
    const methodName = DataViewUtils.getMethodNameByType(BinaryOperation.WRITE, type)
    const method = this.dataView[methodName]
    method(this.position, value, endianness ?? this.endianness)
    return this
  }

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

  writeString(value, { encoding = 'utf8', bytes, end = 0x00 } = {}) {
    const encoder = new TextEncoder(encoding)
    const buffer = encoder.encode(value)
    return this.writeBuffer(buffer, bytes)
  }
}
