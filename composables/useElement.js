/**
 * Uses an element as a child of another element when the component is mounted.
 *
 * @param {Ref<HTMLElement>} parent
 * @param {Ref<HTMLElement>|HTMLElement} child
 */
export function useElement(parent, child) {
  if  (!isRef(parent)) {
    throw new Error('Parent must be a ref')
  }

  onMounted(() => {
    parent.value.appendChild(unref(child))
  })
}

export default useElement
