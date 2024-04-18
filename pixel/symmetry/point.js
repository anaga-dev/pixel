export function symmetryMap(x, sym, min, max) {
  const d = Math.abs(x - sym)
  if (x < sym) {
    return sym + d - 1
  }
  return sym - d
}

export function symmetryPoint(
  index,
  x,
  y,
  symmetryX,
  symmetryY,
  width,
  height
) {
  switch (index) {
    case 0:
      return { index: 0, x, y }
    case 1:
      return {
        index: 1,
        x: symmetryMap(x, symmetryX, 0, width),
        y
      }
    case 2:
      return {
        index: 2,
        x,
        y: symmetryMap(y, symmetryY, 0, height)
      }
    case 3:
      return {
        index: 3,
        x: symmetryMap(x, symmetryX, 0, width),
        y: symmetryMap(y, symmetryY, 0, height)
      }
  }
}

export default symmetryPoint
