<template>
  <div ref="container" class="hue-picker" @pointerdown="onDown">
    <!-- Picker -->
    <div class="bar" :style="{ left: `${((props.modelValue / 360) * 100)}%` }">

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  }
})

const container = ref()

const emit = defineEmits(['update:modelValue'])

function onMove(e) {
  const { width } = container.value.getBoundingClientRect()
  emit('update:modelValue', Math.floor(e.offsetX / width * 360))
}

function onUp(e) {
  const { width } = container.value.getBoundingClientRect()
  emit('update:modelValue', Math.floor(e.offsetX / width * 360))
  container.value.removeEventListener('pointermove', onMove)
  container.value.removeEventListener('pointerup', onUp)
}

function onDown(e) {
  const { width } = container.value.getBoundingClientRect()
  emit('update:modelValue', Math.floor(e.offsetX / width * 360))
  container.value.addEventListener('pointermove', onMove)
  container.value.addEventListener('pointerup', onUp)
}
</script>

<style scoped>
.hue-picker {
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
  height: 2rem;
  position: relative;
}

.bar {
  pointer-events: none;
  position: absolute;
  width: 1px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
