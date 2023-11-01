/**
 * Uses an element as a child of another element when the component is mounted.
 *
 * @param {Ref<Element>} parent
 * @param {*} child
 */
export function useElement(parent, child) {
  if  (!isRef(parent)) {
    throw new Error('Parent must be a ref')
  }

  onMounted(() => {
    const element = isRef(child) ? child.value : child
    parent.value.appendChild(element)
  })
}

export default useElement
