import { isRef, ref, reactive, computed } from 'vue'
import addEventListeners from './addEventListeners'
import removeEventListeners from './removeEventListeners'
import useEventListeners from './useEventListeners'

/**
 *
 * @param {Element|Ref<Element>} element
 */
export function usePointer(element, callback, mode = 'down') {
  const page = reactive({ x: 0, y: 0 })
  const client = reactive({ x: 0, y: 0 })
  const offset = reactive({ x: 0, y: 0 })
  const previous = reactive({ x: 0, y: 0 })
  const current = reactive({ x: 0, y: 0 })
  const start = reactive({ x: 0, y: 0 })
  const end = reactive({ x: 0, y: 0 })
  const screen = reactive({ x: 0, y: 0 })
  const tilt = reactive({ x: 0, y: 0 })
  const movement = reactive({ x: 0, y: 0 })
  const absolute = reactive({ x: 0, y: 0 })
  const relative = reactive({ x: 0, y: 0 })
  const rel = reactive({ x: 0, y: 0 })
  const twist = ref(0)
  const id = ref('')
  const type = ref('')
  const pressure = ref(0)
  const tangentialPressure = ref(0)
  const width = ref(0)
  const height = ref(0)
  const isPrimary = ref(0)
  const target = ref()
  const currentTarget = ref()
  const isMouse = computed(() => type.value === 'mouse')
  const isPen = computed(() => type.value === 'pen')
  const isTouch = computed(() => type.value === 'touch')
  const isMultiTouch = computed(() => navigator.maxTouchPoints > 1)

  /**
   *
   * @param {PointerEvent} e
   */
  const onPointer = (e) => {
    if (mode === 'down') {
      if (e.type === 'pointerdown') {
        addEventListeners(window, ['pointermove', 'pointerup'], onPointer)
      } else if (e.type === 'pointerup') {
        removeEventListeners(window, ['pointermove', 'pointerup'], onPointer)
      }
    }

    page.x = e.pageX
    page.y = e.pageY
    screen.x = e.screenX
    screen.y = e.screenY
    client.x = e.clientX
    client.y = e.clientY
    tilt.x = e.tiltX
    tilt.y = e.tiltY
    movement.x = e.movementX
    movement.y = e.movementY
    offset.x = e.offsetX
    offset.y = e.offsetY

    /*
    {
      const domTarget = isRef(element) ? element.value : element
      const { left, top, width, height } = domTarget.getBoundingClientRect()
      rel.x = e.clientX - left
      rel.y = e.clientY - top
      console.log(rel.x, rel.y)
    }
    */
    if (e.type === 'pointermove' || e.type === 'pointerup') {
      previous.x = current.x
      previous.y = current.y
      current.x = Math.floor(offset.x)
      current.y = Math.floor(offset.y)
      relative.x = Math.floor(current.x - previous.x)
      relative.y = Math.floor(current.y - previous.y)
      if (e.type === 'pointerup') {
        end.x = current.x
        end.y = current.y
        const domTarget = isRef(element) ? element.value : element
        domTarget.releasePointerCapture(e.pointerId)
      }
    } else if (e.type === 'pointerdown') {
      start.x = Math.floor(offset.x)
      start.y = Math.floor(offset.y)
      previous.x = current.x = Math.floor(offset.x)
      previous.y = current.y = Math.floor(offset.y)
      relative.x = 0
      relative.y = 0
      const domTarget = isRef(element) ? element.value : element
      domTarget.setPointerCapture(e.pointerId)
    }
    target.value = e.target
    currentTarget.value = e.currentTarget
    id.value = e.pointerId
    type.value = e.pointerType
    isPrimary.value = e.isPrimary
    pressure.value = e.pressure
    tangentialPressure.value = e.tangentialPressure
    width.value = e.width
    height.value = e.height
    twist.value = e.twist
    callback(e)
  }

  function startListening() {
    if (mode === 'down') {
      addEventListeners(element, ['pointerdown'], onPointer)
    } else {
      addEventListeners(element, ['pointerdown', 'pointerup', 'pointermove'], onPointer)
    }
  }

  function stopListening() {
    if (mode === 'down') {
      removeEventListeners(element, ['pointerdown'], onPointer)
      removeEventListeners(window, ['pointermove', 'pointerup'], onPointer)
    } else {
      removeEventListeners(element, ['pointerdown', 'pointerup', 'pointermove'], onPointer)
    }
  }

  return {
    startListening,
    stopListening,
    target,
    currentTarget,
    page,
    client,
    offset,
    start,
    end,
    current,
    previous,
    relative,
    absolute,
    screen,
    movement,
    tilt,
    twist,
    id,
    type,
    pressure,
    tangentialPressure,
    width,
    height,
    isPrimary,
    isMouse,
    isPen,
    isTouch,
    isMultiTouch
  }
}

export default usePointer
