import BinaryReader from '../../io/BinaryReader'

export const SIGNATURE = 'pal\x0a'

/**
 * Guardamos una paleta de DIV Games Studio
 */
export async function save() {

}

/**
 * Cargamos una paleta de DIV Games Studio
 */
export async function load(blob) {
  const binaryReader = await BinaryReader.fromBlob(blob)
  return binaryReader.readType(PALTypeRegister, 'file')
}
