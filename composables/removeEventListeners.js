export function removeEventListeners(target, types, callback) {
  types.forEach((type) => target.removeEventListener(type, callback))
}

export default removeEventListeners
