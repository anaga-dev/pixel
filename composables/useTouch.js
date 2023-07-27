import { usePoint } from '@/composables/usePoint'
import useEventListeners from './useEventListeners'

function computeMinMax(touches) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (let index = 0; index < 2 && index < touches.length; index++) {
    const touch = touches[index]
    minX = Math.min(touch.clientX, minX)
    maxX = Math.max(touch.clientX, maxX)
    minY = Math.min(touch.clientY, minY)
    maxY = Math.max(touch.clientY, maxY)
  }
  return [minX, maxX, minY, maxY]
}

function computeDelta(bounds) {
  const [minX, maxX, minY, maxY] = bounds
  const deltaX = maxX - minX
  const deltaY = maxY - minY
  return [deltaX, deltaY]
}

function computeMid(touches, bounds) {
  if (touches.length > 1) {
    const [minX, maxX, minY, maxY] = bounds
    const midX = minX + (maxX - minX) * 0.5
    const midY = minY + (maxY - minY) * 0.5
    return usePoint(midX, midY)
  } else if (touches.length === 1) {
    const [touch] = touches
    return usePoint(touch.clientX, touch.clientY)
  } else {
    return usePoint(0, 0)
  }
}

function computeAngle(touches) {
  if (touches.length < 2) {
    return 0
  }
  const [start, end] = touches
  const deltaX = end.clientX - start.clientX
  const deltaY = end.clientY - start.clientY
  return Math.atan2(deltaX, deltaY)
}

function computeDistance(touches) {
  if (touches.length < 2) {
    return 0
  }
  const [start, end] = touches
  const deltaX = end.clientX - start.clientX
  const deltaY = end.clientY - start.clientY
  return Math.hypot(deltaX, deltaY)
}

export function useTouch(callback, options) {
  const target = options?.target ?? globalThis ?? null
  const passive = options?.passive ?? true

  const state = {
    type: null,
    touches: 0,
    currentAngle: 0,
    previousAngle: 0,
    currentAngle: 0,
    startAngle: 0,
    endAngle: 0,
    angle: 0,
    startDistance: 0,
    currentDistance: 0,
    previousDistance: 0,
    endDistance: 0,
    distance: 1,
    delta: usePoint(),
    movement: usePoint(),
    center: usePoint(),
    currentCenter: usePoint(),
    previousCenter: usePoint(),
    startCenter: usePoint(),
    endCenter: usePoint(),
  }

  function updateStateFromEvent(e, state) {
    state.type = e.type
    state.touches = e.touches.length
    const bounds = computeMinMax(e.touches)
    const delta = computeDelta(bounds)
    const center = computeMid(e.touches, bounds)
    const distance = computeDistance(e.touches)
    const angle = computeAngle(e.touches)
    state.delta.copy(delta)
    state.center.copy(center)

    if (e.type === 'touchstart') {
      state.startDistance = distance
      state.endDistance = distance
      state.currentDistance = distance
      state.previousDistance = distance

      state.startAngle = angle
      state.endAngle = angle
      state.currentAngle = angle
      state.previousAngle = angle

      state.startCenter.copy(center)
      state.endCenter.copy(center)
      state.currentCenter.copy(center)
      state.previousCenter.copy(center)
    }

    state.previousDistance = state.currentDistance
    state.currentDistance = distance
    state.previousAngle = state.currentAngle
    state.currentAngle = angle
    state.previousCenter.copy(state.currentCenter)
    state.currentCenter.copy(center)

    if (e.type === 'touchend' || e.type === 'touchcancel') {
      state.endDistance = state.currentDistance
      state.endAngle = state.currentAngle
      state.endCenter.copy(center)
    }

    state.angle = state.currentAngle - state.previousAngle
    state.distance = state.currentDistance / state.previousDistance

    state.movement.copy(state.currentCenter).subtract(state.previousCenter)
  }

  function handler(e) {
    if (e.type === 'touchend' || e.type === 'touchcancel') return

    updateStateFromEvent(e, state)
    callback(state)
  }

  console.info('Touch events initialized')
  useEventListeners(
    target,
    ['touchstart', 'touchmove', 'touchcancel', 'touchend'],
    handler,
    { passive }
  )

  return {
    ...state,
  }
}

export default useTouch
