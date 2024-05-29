import addEventListeners from './addEventListeners'
import removeEventListeners from './removeEventListeners'
import useEventListeners from './useEventListeners'

/**
 *
 * @param {Object} options
 */
export function usePointer(options) {
  const target = ref(null)
  const twist = ref(null) //e.twist
  const pointerId = ref(null) //e.pointerId
  const pointerType = ref(null) // e.pointerType
  const pressure = ref(null) // e.pressure
  const tangentialPressure = ref(null) // e.tangentialPressure
  const width = ref(null) // e.width
  const height = ref(null) // e.height
  const button = ref(0)
  const buttons = ref(0)
  const isPrimary = ref(null) // e.isPrimary
  const activePointers = ref(0)
  const isMouse = computed(() => pointerType.value === 'mouse')
  const isPen = computed(() => pointerType.value === 'pen')
  const isTouch = computed(() => pointerType.value === 'touch')
  const isMultiTouch = computed(() => navigator.maxTouchPoints > 1)
  const page = usePoint()
  const client = usePoint()
  const offset = usePoint()
  const previous = usePoint()
  const current = usePoint()
  const start = usePoint()
  const end = usePoint()
  const screen = usePoint()
  const tilt = usePoint()
  const movement = usePoint()
  const absolute = usePoint()
  const relative = usePoint()

  let callback = null

  function listen(cb, domTarget) {
    if (typeof cb !== 'function') {
      throw new TypeError('Callback must be a function')
    }
    callback = cb
    target.value = unref(domTarget ?? window)
    target.value.addEventListener('pointerdown', onPointer)
    target.value.addEventListener('pointermove', onPointer)
    target.value.addEventListener('pointerup', onPointer)
    target.value.addEventListener('pointerleave', onPointer)
  }

  function unlisten() {
    callback = null
    if (!target.value) return
    target.value.removeEventListener('pointerdown', onPointer)
    target.value.removeEventListener('pointermove', onPointer)
    target.value.removeEventListener('pointerup', onPointer)
    target.value.removeEventListener('pointerleave', onPointer)
  }

  const composable = {
    page,
    client,
    offset,
    previous,
    current,
    start,
    end,
    screen,
    tilt,
    movement,
    absolute,
    relative,
    twist,
    pointerId,
    pointerType,
    pressure,
    tangentialPressure,
    activePointers,
    width,
    height,
    button,
    buttons,
    isPrimary,
    isMouse,
    isPen,
    isTouch,
    isMultiTouch,
    listen,
    unlisten
  }

  /**
   *
   * @param {PointerEvent} e
   */
  function onPointer(e) {
    if (e.type === 'pointerdown') {
      activePointers.value++
    }
    if (e.type === 'pointerup') {
      if (activePointers.value > 0) {
        activePointers.value--
      }
    }

    button.value = e.button
    buttons.value = e.buttons
    twist.value = e.twist
    pointerId.value = e.pointerId
    pointerType.value = e.pointerType
    pressure.value = e.pressure
    tangentialPressure.value = e.tangentialPressure
    width.value = e.width
    height.value = e.height
    isPrimary.value = e.isPrimary

    page.x.value = e.pageX
    page.y.value = e.pageY
    screen.x.value = e.screenX
    screen.y.value = e.screenY
    client.x.value = e.clientX
    client.y.value = e.clientY
    tilt.x.value = e.tiltX
    tilt.y.value = e.tiltY
    movement.x.value = e.movementX
    movement.y.value = e.movementY
    offset.x.value = e.offsetX
    offset.y.value = e.offsetY

    if (e.type === 'pointermove' || e.type === 'pointerup') {
      previous.x.value = current.x.value
      previous.y.value = current.y.value
      current.x.value = offset.x.value
      current.y.value = offset.y.value
      relative.x.value = current.x.value - previous.x.value
      relative.y.value = current.y.value - previous.y.value
      absolute.x.value -= relative.x.value
      absolute.y.value -= relative.y.value
      if (e.type === 'pointerup') {
        end.x.value = current.x.value
        end.y.value = current.y.value
      }
    } else if (e.type === 'pointerdown') {
      start.x.value = offset.x.value
      start.y.value = offset.y.value
      previous.x.value = current.x.value = offset.x.value
      previous.y.value = current.y.value = offset.y.value
      relative.x.value = 0
      relative.y.value = 0
      absolute.x.value = 0
      absolute.y.value = 0
    }

    if (callback !== null && typeof callback === 'function') {
      callback(e)
    }
  }
  return composable
}

export default usePointer
