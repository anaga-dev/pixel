import BinaryType from "./BinaryType.js"

/**
 * Map of binary types and their info.
 */
export const BinaryTypeData = {
  [BinaryType.U1]: [1, 'Uint8Array', 'getUint8', 'setUint8'],
  [BinaryType.U2]: [2, 'Uint16Array', 'getUint16', 'setUint16'],
  [BinaryType.U4]: [4, 'Uint32Array', 'getUint32', 'setUint32'],
  [BinaryType.U8]: [8, 'BigUint64Array', 'getBigUint64', 'setBigUint64'],
  [BinaryType.S1]: [1, 'Int8Array', 'getInt8', 'setInt8'],
  [BinaryType.S2]: [2, 'Int16Array', 'getInt16', 'setInt16'],
  [BinaryType.S4]: [4, 'Int32Array', 'getInt32', 'setInt32'],
  [BinaryType.S8]: [8, 'BigInt64Array', 'getBigInt64', 'setBigInt64'],
  [BinaryType.F4]: [4, 'Float32Array', 'getFloat32', 'setFloat32'],
  [BinaryType.F8]: [8, 'Float64Array', 'getFloat64', 'setFloat64']
}

export default BinaryTypeData
