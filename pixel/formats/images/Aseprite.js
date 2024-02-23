import BinaryType from '@/pixel/io/BinaryType.js'
import BinaryReader from '@/pixel/io/BinaryReader.js'
import BinaryWriter from '@/pixel/io/BinaryWriter.js'

// @see https://github.com/aseprite/aseprite/blob/main/docs/ase-file-specs.md

export const FILE_MAGIC_NUMBER = 0xA5E0
export const FRAME_MAGIC_NUMBER = 0xF1FA

export const BlendMode = {
  NORMAL         : 0,
  MULTIPLY       : 1,
  SCREEN         : 2,
  OVERLAY        : 3,
  DARKEN         : 4,
  LIGHTEN        : 5,
  COLOR_DODGE    : 6,
  COLOR_BURN     : 7,
  HARD_LIGHT     : 8,
  SOFT_LIGHT     : 9,
  DIFFERENCE     : 10,
  EXCLUSION      : 11,
  HUE            : 12,
  SATURATION     : 13,
  COLOR          : 14,
  LUMINOSITY     : 15,
  ADDITION       : 16,
  SUBTRACT       : 17,
  DIVIDE         : 18,
}

export const ColorDepth = {
  RGBA           : 32,
  GRAYSCALE      : 16,
  INDEXED        : 8,
}

/**
 * Writes an Aseprite file.
 *
 * @param {Document} document
 * @returns {Promise<Blob>}
 */
export async function save(document) {
  const BinaryWriter = new BinaryWriter()
  // 128 bytes header
  for (let index = 0; index < document.layers; index++) {
    const layer = document.layers[index]
    // 16 bytes per frame
  }
}

/**
 * Reads an Aseprite file.
 *
 * @type {Blob} blob
 * @returns {Promise<Document>}
 */
export function load(blob) {
  const binaryReader = BinaryReader.fromBlob(blob)
  const fileSize = binaryReader.read(BinaryType.U4)
  const magicNumber = binaryReader.read(BinaryType.U2)
  if (magicNumber !== FILE_MAGIC_NUMBER) {
    throw new Error('Invalid magic number')
  }
  const frames = binaryReader.read(BinaryType.U2)
  const width = binaryReader.read(BinaryType.U2)
  const height = binaryReader.read(BinaryType.U2)
  const colorDepth = binaryReader.read(BinaryType.U2)
  const flags = binaryReader.read(BinaryType.U4)
  const speed = binaryReader.read(BinaryType.U2)
  const transparentColorIndex = binaryReader.read(BinaryType.U1)
  const ignoreColorIndex = binaryReader.read(BinaryType.U1)
  const pixelWidth = binaryReader.read(BinaryType.U1)
  const pixelHeight = binaryReader.read(BinaryType.U1)
  const gridX = binaryReader.read(BinaryType.S2)
  const gridY = binaryReader.read(BinaryType.S2)
  const gridWidth = binaryReader.read(BinaryType.U2)
  const gridHeight = binaryReader.read(BinaryType.U2)
  binaryReader.skip(84)

  for (let frameIndex = 0; frameIndex < frames; frameIndex++) {
    const frameSize = binaryReader.read(BinaryType.U4)
    const magicNumber = binaryReader.read(BinaryType.U2)
    if (magicNumber !== FRAME_MAGIC_NUMBER) {
      throw new Error('Invalid magic number')
    }
    // Old field which specifies the number of "chunks"
    const oldNumberOfChunks = binaryReader.read(BinaryType.U2)
    const frameDuration = binaryReader.read(BinaryType.U2)
    binaryReader.skip(2)
    const numberOfChunks = binaryReader.read(BinaryType.U4)
    for (let chunkIndex = 0; chunkIndex < numberOfChunks; chunkIndex++) {
      const chunkSize = binaryReader.read(BinaryType.U4)
      const chunkType = binaryReader.read(BinaryType.U2)
      switch (chunkType) {
        // Old Palette Chunk
        case 0x0004:
        case 0x0011: {
          const numberOfPackets = binaryReader.read(BinaryType.U2)
          for (let packetIndex = 0; packetIndex < numberOfPackets; packetIndex++) {
            const numberOfPaletteEntriesToSkip = binaryReader.read(BinaryType.U1)
            const numberOfColors = binaryReader.read(BinaryType.U1) || 256
            for (let colorIndex = 0; colorIndex < numberOfColors; colorIndex++) {
              const r = binaryReader.read(BinaryType.U1) * (chunkType === 0x0004 ? 1 : 4)
              const g = binaryReader.read(BinaryType.U1) * (chunkType === 0x0004 ? 1 : 4)
              const b = binaryReader.read(BinaryType.U1) * (chunkType === 0x0004 ? 1 : 4)
            }
          }
        } break;

        // Layer Chunk
        case 0x2004: {
          const flags = binaryReader.read(BinaryType.U2)
          const layerType = binaryReader.read(BinaryType.U2)
          const layerChildLevel = binaryReader.read(BinaryType.U2)
          const defaultLayerWidth = binaryReader.read(BinaryType.U2)
          const defaultLayerHeight = binaryReader.read(BinaryType.U2)
          const blendMode = binaryReader.read(BinaryType.U2)
          const opacity = binaryReader.read(BinaryType.U1)
          binaryReader.skip(3)
          const layerName = binaryReader.readString()
          if (layerType === 2) {
            const tileSetIndex = binaryReader.read(BinaryType.U4)
          }
        } break;

        // CEL Chunk
        case 0x2005: {
          const layerIndex = binaryReader.read(BinaryType.U2)
          const x = binaryReader.read(BinaryType.S2)
          const y = binaryReader.read(BinaryType.S2)
          const opacity = binaryReader.read(BinaryType.U1)
          const celType = binaryReader.read(BinaryType.U1)
          const zIndex = binaryReader.read(BinaryType.S2)
          binaryReader.skip(5)
          switch (celType) {
            case 0:{
              const width = binaryReader.read(BinaryType.U2)
              const height = binaryReader.read(BinaryType.U2)
              // TODO: Read uncompressed data
            } break;

            case 1: {
              const linkedFramePosition = binaryReader.read(BinaryType.U2)
            } break;

            case 2: {
              const width = binaryReader.read(BinaryType.U2)
              const height = binaryReader.read(BinaryType.U2)
              // TODO: Read compressed data (zlib)
            } break;

            case 3: {
              const width = binaryReader.read(BinaryType.U2)
              const height = binaryReader.read(BinaryType.U2)
              const bitsPerTile = binaryReader.read(BinaryType.U2)
              const bitmaskForTileID = binaryReader.read(BinaryType.U4)
              const bitmaskFlipX = binaryReader.read(BinaryType.U4)
              const bitmaskFlipY = binaryReader.read(BinaryType.U4)
              const bitmaskFlipDiagonal = binaryReader.read(BinaryType.U4)
              binaryReader.skip(10)
              // TODO: Read compressed data (zlib)
            }
          }
          const data = binaryReader.readBuffer(chunkSize - 16)
        } break;

        // CEL Extra Chunk
        case 0x2006: {
          const flags = binaryReader.read(BinaryType.U2)
          // TODO: The next 4 fields use FIXED (16.16) point format.
          const x = binaryReader.read(BinaryType.U4)
          const y = binaryReader.read(BinaryType.U4)
          const widthScaled = binaryReader.read(BinaryType.U4)
          const heightScaled = binaryReader.read(BinaryType.U4)
          binaryReader.skip(16)
        } break;

        // Color Profile Chunk
        case 0x2007: {
          const type = binaryReader.read(BinaryType.U2)
          const flags = binaryReader.read(BinaryType.U2)
          // FIXED
          const gamma = binaryReader.read(BinaryType.U4)
          binaryReader.skip(8)
          if (type === 2) {
            const iccProfileSize = binaryReader.read(BinaryType.U4)
            const iccProfile = binaryReader.readBuffer(iccProfileSize)
          }
        } break;

        // External Files Chunk
        case 0x2008: {
          const numberOfEntries = binaryReader.read(BinaryType.U4)
          binaryReader.skip(8)
          for (let entryIndex = 0; entryIndex < numberOfEntries; entryIndex++) {
            const entryID = binaryReader.read(BinaryType.U4)
            const entryType = binaryReader.read(BinaryType.U1)
            binaryReader.skip(7)
            const entryFileName = binaryReader.readString()
          }
        } break;

        // Mask Chunk (DEPRECATED)
        case 0x2016: {
          const x = binaryReader.read(BinaryType.S2)
          const y = binaryReader.read(BinaryType.S2)
          const width = binaryReader.read(BinaryType.U2)
          const height = binaryReader.read(BinaryType.U2)
          binaryReader.skip(8)
          const maskName = binaryReader.readString()
          // TODO: Read uncompressed data
        } break;

        // Path Chunk (NEVER USED)
        case 0x2017: break;

        // Tags Chunk
        case 0x2018: {
          const numberOfTags = binaryReader.read(BinaryType.U2)
          binaryReader.skip(8)
          for (let tagIndex = 0; tagIndex < numberOfTags; tagIndex++) {
            const fromFrame = binaryReader.read(BinaryType.U2)
            const toFrame = binaryReader.read(BinaryType.U2)
            const loopAnimationDirection = binaryReader.read(BinaryType.U1)
            const repeatCount = binaryReader.read(BinaryType.U2)
            binaryReader.skip(6)
            const rgba = binaryReader.read(BinaryType.U4)
            const name = binaryReader.readString()
          }
        } break;

        // Palette Chunk
        case 0x2019: {
          const paletteSize = binaryReader.read(BinaryType.U4)
          const firstColorIndex = binaryReader.read(BinaryType.U4)
          const lastColorIndex = binaryReader.read(BinaryType.U4)
          binaryReader.skip(8)
          for (let paletteIndex = firstColorIndex; paletteIndex <= lastColorIndex; paletteIndex++) {
            const flags = binaryReader.read(BinaryType.U2)
            const rgba = binaryReader.read(BinaryType.U4)
            if (flags & 0x01 === 0x01) {
              const name = binaryReader.readString()
            }
          }
        } break;

        // User Data Chunk
        case 0x2020: {
          binaryReader.skip(chunkSize)
          /*
          const flags = binaryReader.read(BinaryType.U4)
          if (flags & 0x01 === 0x01) {
            const text = binaryReader.readString()
          }
          if (flags & 0x02 === 0x02) {
            const rgba = binaryReader.read(BinaryType.U4)
          }
          if (flags & 0x04 === 0x04) {
            const propertyMapSize = binaryReader.read(BinaryType.U4)
            const numberOfPropertyMaps = binaryReader.read(BinaryType.U4)
            for (let propertyMapIndex = 0; propertyMapIndex < numberOfPropertyMaps; propertyMapIndex++) {
              const propertyMapKey = binaryReader.readString()
              const propertyMapValue = binaryReader.readString()
            }
          }
          */
        } break;

        // Slice Chunk
        case 0x2022: {
          const numberOfSliceKeys = binaryReader.read(BinaryType.U4)
          const flags = binaryReader.read(BinaryType.U4)
          binaryReader.skip(4)
          const name = binaryReader.readString()
          for (let sliceKeyIndex = 0; sliceKeyIndex < numberOfSliceKeys; sliceKeyIndex++) {
            const frameNumber = binaryReader.read(BinaryType.U4)
            const x = binaryReader.read(BinaryType.S4)
            const y = binaryReader.read(BinaryType.S4)
            const width = binaryReader.read(BinaryType.U4)
            const height = binaryReader.read(BinaryType.U4)
            if (flags & 0x01 === 0x01) {
              const centerX = binaryReader.read(BinaryType.S4)
              const centerY = binaryReader.read(BinaryType.S4)
              const centerWidth = binaryReader.read(BinaryType.U4)
              const centerHeight = binaryReader.read(BinaryType.U4)
            }
            if (flags & 0x02 === 0x02) {
              const pivotX = binaryReader.read(BinaryType.S4)
              const pivotY = binaryReader.read(BinaryType.S4)
            }
          }

        } break;

        // Tileset Chunk
        case 0x2023: {
          const id = binaryReader.read(BinaryType.U4)
          const flags = binaryReader.read(BinaryType.U4)
          const numberOfTiles = binaryReader.read(BinaryType.U4)
          const tileWidth = binaryReader.read(BinaryType.U2)
          const tileHeight = binaryReader.read(BinaryType.U2)
          const baseIndex = binaryReader.read(BinaryType.S2)
          binaryReader.skip(14)
          const name = binaryReader.readString()
          if (flags & 0x01 === 0x01) {
            const externalFileID = binaryReader.read(BinaryType.U4)
            const tileSetID = binaryReader.read(BinaryType.U4)
          }
          if (flags & 0x02 === 0x02) {
            const compressedDataSize = binaryReader.read(BinaryType.U4)
            binaryReader.skip(compressedDataSize)
          }
        } break;
      }
    }
  }
}

export default {
  save,
  load,
}
