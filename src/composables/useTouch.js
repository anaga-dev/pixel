import { ref, reactive } from 'vue'
import Vec2 from '../math/Vec2'
import useEventListeners from './useEventListeners'

function computeMinMax(e) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const touch of e.touches) {
    minX = Math.min(touch.clientX, minX)
    maxX = Math.max(touch.clientX, maxX)
    minY = Math.min(touch.clientY, minY)
    maxY = Math.max(touch.clientY, maxY)
  }
  return [minX, maxX, minY, maxY]
}

function computeDelta(e) {
  const [minX, maxX, minY, maxY] = computeMinMax(e)
  const deltaX = maxX - minX
  const deltaY = maxY - minY
  return [deltaX, deltaY]
}

function computeMid(e) {
  if (e.touches.length > 1) {
    const [minX, maxX, minY, maxY] = computeMinMax(e)
    const midX = minX + (maxX - minX) * 0.5
    const midY = minY + (maxY - minY) * 0.5
    return [midX, midY]
  } else {
    const [touch] = e.touches
    return [touch.clientX, touch.clientY]
  }
}

export function useTouch(target) {
  const distance = ref(1)
  const angle = ref(0)
  const fingers = ref(0)
  const movement = reactive([0, 0])

  // Si el dispositivo no soporta eventos táctiles, salimos.
  if (navigator.maxTouchPoints === 0) {
    console.warn('Touch events not initialized')
    return {
      supported: false,
      distance,
      angle
    }
  }

  let previous = Vec2.create()
  let current = Vec2.create()
  let initialAngle = Infinity
  let initialDistance = Infinity

  console.info('Touch events initialized')
  useEventListeners(target, ['touchstart', 'touchmove', 'touchcancel', 'touchend'], (e) => {
    fingers.value = e.touches.length
    if (e.type === 'touchstart') {
      if (e.touches.length >= 2) {
        const [deltaX, deltaY] = computeDelta(e)
        const [midX, midY] = computeMid(e)
        Vec2.copy(previous, current)
        Vec2.set(previous, midX, midY)
        initialAngle = Math.atan2(deltaY, deltaX)
        initialDistance = Math.hypot(deltaX, deltaY)
        distance.value = 1
        angle.value = 0
      }
    } else if (e.type === 'touchmove') {
      if (e.touches.length >= 2) {
        const [deltaX, deltaY] = computeDelta(e)
        if (!Number.isFinite(initialAngle)) {
          initialAngle = Math.atan2(deltaY, deltaX)
        }
        if (!Number.isFinite(initialDistance)) {
          initialDistance = Math.hypot(deltaX, deltaY)
        }
        const [midX, midY] = computeMid(e)
        Vec2.set(current, midX, midY)
        Vec2.subtract(movement, current, previous)
        Vec2.copy(previous, current)
        const newDistance = Math.hypot(deltaX / initialDistance, deltaY / initialDistance)
        const newAngle = Math.atan2(deltaY, deltaX) - initialAngle
        distance.value = newDistance
        angle.value = newAngle
        initialAngle = Math.atan2(deltaY, deltaX)
        initialDistance = Math.hypot(deltaX, deltaY)
      }
    } else if (e.type === 'touchend' || e.type === 'touchcancel') {
      initialAngle = Infinity
      initialDistance = Infinity
    }
  })

  return {
    supported: false,
    fingers,
    distance,
    angle,
    movement
  }
}

export default useTouch
