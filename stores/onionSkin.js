export const useOnionSkin = defineStore('onionSkin', () => {
  const opacity = ref(0.5)
  const color = ref('original') // original, tint, silhouette
  const loop = ref(true)
  const keyFramesBefore = ref(2)
  const keyFramesAfter = ref(2)

  return {
    opacity,
    color,
    loop,
    keyFramesBefore,
    keyFramesAfter,
  }
})
