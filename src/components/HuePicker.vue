<template>
  <div ref="container" class="HuePicker" @pointerdown="onPointer">
    <!-- Picker -->
    <div class="bar" :style="{ left: `${((hue / 360) * 100)}%` }">
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useColor } from '@/composables/useColor'

const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})

const { hue } = props.color

const container = ref()

function onPointer(e) {
  if (e.type === 'pointerdown') {
    window.addEventListener('pointermove', onPointer)
    window.addEventListener('pointerup', onPointer)
  } else if (e.type === 'pointerup') {
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('pointerup', onPointer)
  }
  const { width } = container.value.getBoundingClientRect()
  hue.value = Math.floor(e.offsetX / width * 360)
}
</script>

<style scoped>
.HuePicker {
  background: linear-gradient(to right,
    hsl(0, 100%, 50%),
    hsl(30, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(90, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(150, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(210, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(270, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(330, 100%, 50%),
    hsl(360, 100%, 50%)
  );
  height: var(--spaceL);
  position: relative;
}

.bar {
  pointer-events: none;
  position: absolute;
  width: 2px;
  height: 100%;
  background-color: var(--colorLayer1);
}
</style>
