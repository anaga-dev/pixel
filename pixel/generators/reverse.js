/**
 * Reverse the order of the elements in the list.
 *
 * @param {ArrayLike} list
 * @returns {Generator}
 */
export function * reverse(list) {
  for (let index = list.length - 1; index >= 0; --index) {
    yield list[index]
  }
}

export default reverse
