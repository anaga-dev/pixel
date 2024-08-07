<script setup>
const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['update'])

const { hue, style } = props.color

const container = ref()
const boundingClientRect = computed(() =>
  container.value.getBoundingClientRect()
)

const computedStyle = computed(() => {
  const containerWidth = container.value
    ? boundingClientRect.value.width
    : 0
  const translateX = Math.round((hue.value / 360) * containerWidth)
  return `transform: translateX(${translateX}px);`
})

function startDragging(e) {
  const { width } = boundingClientRect.value
  hue.value = Math.round((e.offsetX / width) * 360)
  window.addEventListener('pointermove', updateHue)
  window.addEventListener('pointerup', stopDragging, { once: true })
  window.addEventListener('pointerleave', stopDragging, { once: true })
}

function updateHue(e) {
  const { width } = boundingClientRect.value
  hue.value = Math.max(0, Math.min(360, Math.round((e.offsetX / width) * 360)))
}

function stopDragging(e) {
  window.removeEventListener('pointermove', updateHue)
  window.removeEventListener('pointerup', stopDragging)
  window.removeEventListener('pointerleave', stopDragging)
  if (e.type === 'pointerup') {
    emit('update', style.value)
  }
}
</script>

<template>
  <div
    ref="container"
    class="HuePicker"
    @pointerdown="startDragging"
  >
    <!-- Picker -->
    <div
      class="bar"
      :style="computedStyle"
    />
  </div>
</template>

<style scoped>
.HuePicker {
  background: linear-gradient(
    to right,
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
  height: var(--space-l);
  position: relative;
  user-select: none;
}

.bar {
  user-select: none;
  pointer-events: none;
  position: absolute;
  left: 0;
  width: 0;
  height: 100%;
}

.bar::after {
  position: absolute;
  content: '';
  display: block;
  width: 2px;
  height: 100%;
  translate: -50% 0%;
  background-color: var(--color-base-950);
  outline: 2px solid var(--color-base-50);
}
</style>
