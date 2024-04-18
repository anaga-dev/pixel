import SymmetryAxis from '~/pixel/enums/SymmetryAxis.js'

/**
 *
 * @param {SymmetryAxis} axis
 * @returns {IterableIterator<{x: number, y: number}>}
 */
export function* symmetryAxis(axis) {
  yield 0
  if (axis === SymmetryAxis.BOTH || axis === SymmetryAxis.HORIZONTAL) {
    yield 1
  }
  if (axis === SymmetryAxis.BOTH || axis === SymmetryAxis.VERTICAL) {
    yield 2
  }
  if (axis === SymmetryAxis.BOTH) {
    yield 3
  }
}

export default symmetryAxis
