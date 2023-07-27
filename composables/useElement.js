
/**
 *
 * @param {Ref<Element>} parent
 * @param {*} child
 */
export function useElement(parent, child) {
  onMounted(() => {
    if (isRef(child)) {
      parent.value.appendChild(child.value)
    } else {
      parent.value.appendChild(child)
    }
  })
}

export default useElement
