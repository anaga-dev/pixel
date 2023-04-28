import Vec2 from '../math/Vec2'
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
    return [midX, midY]
  } else if (touches.length === 1) {
    const [touch] = touches
    return [touch.clientX, touch.clientY]
  } else {
    return [0, 0]
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

export function useTouch(callback, options = {}) {
  const { target = window, passive } = options
  console.log(target)

  // Si el dispositivo no soporta eventos táctiles, salimos.
  if (navigator.maxTouchPoints === 0) {
    console.warn('Touch events not initialized')
    return {
      supported: false
    }
  }

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
    delta: [0, 0],
    movement: [0, 0],
    center: [0, 0],
    currentCenter: [0, 0],
    previousCenter: [0, 0],
    startCenter: [0, 0],
    endCenter: [0, 0],
  }

  function updateStateFromEvent(e, state) {
    state.type = e.type
    state.touches = e.touches.length
    const bounds = computeMinMax(e.touches)
    const delta = computeDelta(bounds)
    const center = computeMid(e.touches, bounds)
    const distance = computeDistance(e.touches)
    const angle = computeAngle(e.touches)
    Vec2.copy(state.delta, delta)
    Vec2.copy(state.center, center)

    if (e.type === 'touchstart') {
      state.startDistance = distance
      state.endDistance = distance
      state.currentDistance = distance
      state.previousDistance = distance

      state.startAngle = angle
      state.endAngle = angle
      state.currentAngle = angle
      state.previousAngle = angle

      Vec2.copy(state.startCenter, center)
      Vec2.copy(state.endCenter, center)
      Vec2.copy(state.currentCenter, center)
      Vec2.copy(state.previousCenter, center)
    }

    state.previousDistance = state.currentDistance
    state.currentDistance = distance
    state.previousAngle = state.currentAngle
    state.currentAngle = angle
    Vec2.copy(state.previousCenter, state.currentCenter)
    Vec2.copy(state.currentCenter, center)

    if (e.type === 'touchend' || e.type === 'touchcancel') {
      state.endDistance = state.currentDistance
      state.endAngle = state.currentAngle
      Vec2.copy(state.endCenter, center)
    }

    state.angle = state.currentAngle - state.previousAngle
    state.distance = state.currentDistance / state.previousDistance

    Vec2.subtract(state.movement, state.currentCenter, state.previousCenter)
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
    supported: true,
    ...state,
  }
}

export default useTouch
