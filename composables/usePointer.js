import addEventListeners from './addEventListeners'
import removeEventListeners from './removeEventListeners'
import useEventListeners from './useEventListeners'

/**
 *
 * @param {Element|Ref<Element>} element
 */
export function usePointer(element, callback, { receiver = null, mode = 'down' } = { }) {
  const page = { x: 0, y: 0 }
  const client = { x: 0, y: 0 }
  const offset = { x: 0, y: 0 }
  const previous = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }
  const start = { x: 0, y: 0 }
  const end = { x: 0, y: 0 }
  const screen = { x: 0, y: 0 }
  const tilt = { x: 0, y: 0 }
  const movement = { x: 0, y: 0 }
  const absolute = { x: 0, y: 0 }
  const relative = { x: 0, y: 0 }

  function getReceiver() {
    if (receiver === null) {
      return element
    } else {
      if (isRef(receiver)) {
        return receiver.value
      } else {
        return receiver
      }
    }
  }

  /**
   *
   * @param {PointerEvent} e
   */
  const onPointer = (e) => {
    const twist = e.twist
    const id = e.pointerId
    const type = e.pointerType
    const pressure = e.pressure
    const tangentialPressure = e.tangentialPressure
    const width = e.width
    const height = e.height
    const isPrimary = e.isPrimary
    const isMouse = (() => type.value === 'mouse')()
    const isPen = (() => type.value === 'pen')()
    const isTouch = (() => type.value === 'touch')()
    const isMultiTouch = (() => navigator.maxTouchPoints > 1)()

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

    if (e.type === 'pointermove' || e.type === 'pointerup') {
      previous.x = current.x
      previous.y = current.y
      current.x = offset.x
      current.y = offset.y
      relative.x = current.x - previous.x
      relative.y = current.y - previous.y
      if (e.type === 'pointerup') {
        end.x = current.x
        end.y = current.y
        const domTarget = isRef(element) ? element.value : element
        domTarget.releasePointerCapture(e.pointerId)
      }
    } else if (e.type === 'pointerdown') {
      start.x = offset.x
      start.y = offset.y
      previous.x = current.x = offset.x
      previous.y = current.y = offset.y
      relative.x = 0
      relative.y = 0
      const domTarget = isRef(element) ? element.value : element
      domTarget.setPointerCapture(e.pointerId)
    }
    callback(e, {
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
    })
  }

  if (mode === 'down') {
    useEventListeners(getReceiver(), ['pointerdown'], onPointer)
  } else {
    useEventListeners(
      getReceiver(),
      ['pointerdown', 'pointerup', 'pointermove'],
      onPointer
    )
  }
  return {}
}

export default usePointer
