export function addEventListeners(target, types, callback) {
  types.forEach((type) => target.addEventListener(type, callback))
}

export default addEventListeners
