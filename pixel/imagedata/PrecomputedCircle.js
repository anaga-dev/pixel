import { putColor } from './ImageDataUtils.js'

const brushImageDataList = [
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 0
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 1
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 2
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 3
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 4
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 5
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 6
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 7
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 8
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 9
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 10
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 11
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 12
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 13
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 14
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 15
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 16
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 17
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 18
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 19
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 20
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 21
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 22
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 23
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 24
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 25
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 26
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 27
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 28
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 29
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 30
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 31
  new ImageData(32, 32, [new Uint8ClampedArray(32 * 32 * 4)]), // 32
]

export function isPrecomputedCircleInitialized() {
  return brushImageDataList.length > 0
}

export async function initializePrecomputedCircle() {
  brushImageDataList.length = 0
  brushImageDataList.push(
    ...(await createImageDataListFromURL('/brushes/rounded.png', 32, 32))
  )
}

/**
 *
 * @param {ImageData} imageData
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {Color} color
 * @param {Dither} dither
 * @param {ImageData} [maskImageData]
 */
export function precomputedCircle(
  imageData,
  x,
  y,
  radius,
  color,
  dither,
  maskImageData
) {
  const brushIndex = Math.max(1, Math.min(32, radius)) - 1
  const brushImageData = brushImageDataList[brushIndex]
  const isRadiusEven = radius % 2 === 0

  const ix = isRadiusEven ? x : Math.floor(x)
  const iy = isRadiusEven ? y : Math.floor(y)
  const ccx = isRadiusEven
    ? radius / 2 - Math.round(x - Math.floor(x))
    : radius / 2 - 1
  const ccy = isRadiusEven
    ? radius / 2 - Math.round(y - Math.floor(y))
    : radius / 2 - 1

  for (let cy = 0; cy < brushImageData.height; cy++) {
    for (let cx = 0; cx < brushImageData.width; cx++) {
      const offset = (cy * brushImageData.width + cx) * 4
      if (brushImageData.data[offset] === 0x00) {
        continue
      }
      putColor(
        imageData,
        ix + cx - ccx,
        iy + cy - ccy,
        color,
        dither,
        maskImageData
      )
    }
  }
}
