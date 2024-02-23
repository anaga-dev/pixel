import BinaryView from './BinaryView.js'
import BinaryTypeData from './BinaryTypeData.js'

export default class BinaryReader extends BinaryView {
  /**
   * Gets a BinaryReader from an ArrayBuffer.
   *
   * @param {ArrayBuffer} arrayBuffer
   * @returns {Promise<BinaryReader>}
   */
  static fromArrayBuffer(arrayBuffer) {
    return Promise.resolve(new BinaryReader(new DataView(arrayBuffer)))
  }

  /**
   * Gets a BinaryReader from a Blob.
   *
   * @param {Blob} blob
   * @returns {Promise<BinaryReader>}
   */
  static async fromBlob(blob) {
    const arrayBuffer = await blob.arrayBuffer()
    return this.fromArrayBuffer(arrayBuffer)
  }

  /**
   * Reads a value.
   *
   * @param {BinaryType} type
   * @param {Endianness} [endianness]
   * @returns {number}
   */
  read(type, endianness) {
    const [size, , methodName] = BinaryTypeData[type]
    const method = this.dataView[methodName]
    const value = method(this.position, endianness ?? this.endianness)
    this.position += size
    return value
  }

  readUntil(end) {
    let start = this.position
    while (this.position < this.dataView.byteLength) {
      if (this.dataView.getUint8(this.position) === end) {
        break
      }
      this.position++
    }
    return this.dataView.buffer.slice(start, this.position)
  }

  /**
   * Reads a buffer.
   *
   * @param {number} bytes
   * @returns {ArrayBuffer}
   */
  readBuffer(bytes) {
    const buffer = this.dataView.buffer.slice(this.position, this.position + bytes)
    this.position += bytes
    return buffer
  }

  /**
   * Reads a string.
   *
   * @param {BinaryReaderReadStringOptions} [options]
   * @returns {string}
   */
  readString({ encoding = 'utf8', bytes, end = 0x00 } = {}) {
    const decoder = TextDecoder(encoding)
    if (typeof bytes === 'number' && !Number.isInteger(bytes)) {
      throw new TypeError(`Invalid bytes value "${bytes}"`)
    }
    if (typeof bytes === 'number' && Number.isInteger(bytes)) {
      return decoder.decode(this.readBuffer(bytes))
    } else if (bytes === undefined) {
      return decoder.decode(this.readUntil(end))
    } else {
      throw new TypeError(`Invalid bytes value "${bytes}"`)
    }
  }

  /**
   * Reads a type.
   *
   * @param {BinaryTypeRegister} register
   * @param {string} type
   * @returns {Object}
   */
  readType(register, type) {
    if (!register.isRegistered(type)) {
      throw new Error(`Binary type "${type}" is not registered`)
    }
    const definition = register.get(type)
    const constructor = definition.constructor ?? Object.constructor
    const result = new constructor
    if (constructor === Array) {
      if (BinaryTypes.includes(definition.type)) {
        for (let index = 0; index < definition.size; index++) {
          result.push(this.read(definition.type))
        }
      }
    } else {
      for (const [propertyName, propertyDefinition] of Object.entries(definition.properties)) {
        const { type, size } = propertyDefinition
        if (typeof size === 'number' && Number.isInteger(size)) {
          result[propertyName] = []
          if (BinaryTypes.includes(type)) {
            for (let index = 0; index < size; index++) {
              result[propertyName].push(this.read(type))
            }
          } else {
            for (let index = 0; index < size; index++) {
              result[propertyName].push(this.readType(type))
            }
          }
        } else {
          if (BinaryTypes.includes(type)) {
            result[propertyName] = this.read(type)
          } else {
            result[propertyName] = this.readType(type)
          }
        }
      }
    }
    return result
  }
}
