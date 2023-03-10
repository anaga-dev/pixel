import { computed, ref, unref } from 'vue'
import AnimationState from '../enums/AnimationState'

export function useAnimation({
  initialState = AnimationState.PAUSED,
  initialTotal = 1,
  initialCurrent = 0,
  initialSpeed = 12,
  initialLoop = true,
  callback,
} = {}) {
  const total = ref(initialTotal)
  const current = ref(initialCurrent)
  const speed = ref(initialSpeed)
  const state = ref(initialState)
  const loop = ref(initialLoop)

  const isPaused = computed(() => state.value === AnimationState.PAUSED)
  const isPlaying = computed(() => state.value === AnimationState.PLAYING)
  const canPlay = computed(() => total.value > 1)
  const canGoPrevious = computed(() => canPlay && current.value > 0 && isPaused)
  const canGoNext = computed(() => canPlay && current.value < total.value - 1 && isPaused)
  const canGoFirst = computed(() => canPlay && current.value > 0 && isPaused)
  const canGoLast = computed(() => canPlay && current.value < total.value - 1 && isPaused)

  let timeout = null

  function getAnimationInterval() {
    return 1000 / speed.value
  }

  function requestFrame() {
    return timeout = setTimeout(animate, getAnimationInterval())
  }

  function cancelFrame() {
    clearTimeout(timeout)
    timeout = null
  }

  function animate() {
    if (current.value < total.value - 1) {
      current.value++
    } else {
      if (loop.value) {
        current.value = 0
      } else {
        state.value = AnimationState.PAUSED
      }
    }
    if (typeof callback === 'function') {
      callback()
    }
    if (state.value === AnimationState.PLAYING) {
      requestFrame()
    }
  }

  function play() {
    if (state.value !== AnimationState.PAUSED)
      return false

    // TODO: Esto debería lanzar una función cada X segundos.
    requestFrame()
    state.value = AnimationState.PLAYING
    return true
  }

  function pause() {
    if (state.value !== AnimationState.PLAYING)
      return false

    cancelFrame()
    state.value = AnimationState.PAUSED
    return true
  }

  function toggle() {
    if (state.value === AnimationState.PAUSED) {
      return play()
    } else {
      return pause()
    }
  }

  function go(frame) {
    if (frame < 0 || frame >= total.value) {
      throw new Error(`Invalid frame number ${frame}`)
    }
    current.value = frame
  }

  function first() {
    current.value = 0
  }

  function last() {
    current.value = total.value - 1
  }

  function next() {
    if (current.value < total.value - 1) {
      current.value++
    }
  }

  function previous() {
    if (current.value > 0) {
      current.value--
    }
  }

  const MAX_FRAMES = 1024
  function add() {
    if (total.value < MAX_FRAMES) {
      total.value++
      return true
    }
    return false
  }

  function remove() {
    if (total.value > 0) {
      total.value--
      return true
    }
    return false
  }

  return {
    total,
    current,
    speed,
    state,
    loop,
    isPaused,
    isPlaying,
    canPlay,
    canGoFirst,
    canGoLast,
    canGoNext,
    canGoPrevious,
    add,
    remove,
    play,
    pause,
    toggle,
    go,
    last,
    first,
    next,
    previous
  }
}
