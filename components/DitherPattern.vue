<template>
  <!-- <svg :width="width" :height="height" :viewBox="viewBox"> -->
  <rect
    v-for="rect of rects"
    :key="`${rect.x}-${rect.y}`"
    :x="rect.x"
    :y="rect.y"
    :width="rect.width"
    :height="rect.height"
  />
  <!-- </svg> -->
</template>

<script setup>
import { patterns, ONE } from '@/pixel/paint/Dither'

const props = defineProps({
  level: {
    type: [String, Number],
    required: true
  }
})

const viewSize = 48
const size = 8

const rects = computed(() => {
  const rects = []
  const level = parseInt(props.level, 10)
  const pattern = patterns[level]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const tx = x % 4
      const ty = y % 4
      const tile = pattern[ty * 4 + tx]
      if (tile === ONE) {
        const rx = Math.floor(x / size * viewSize)
        const ry = Math.floor(y / size * viewSize)
        const rs = Math.floor(viewSize / size)
        rects.push({
          x: rx,
          y: ry,
          width: rs,
          height: rs
        })
      }
    }
  }
  return rects
})

</script>
