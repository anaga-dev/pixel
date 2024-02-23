<template>
  <div
    ref="container"
    class="HuePicker"
    @pointerdown="startDragging"
  >
    <!-- Picker -->
    <div
      class="bar"
      :style="{ left: `${((hue / 360) * 100)}%` }"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})

const { hue } = props.color

const container = ref()
const boundingClientRect = computed(() => container.value.getBoundingClientRect())

function startDragging(e) {
  const { width } = boundingClientRect.value
  hue.value = Math.max(0, Math.min(360, Math.round(e.offsetX / width * 360)))
  window.addEventListener('pointermove', updateHue)
  window.addEventListener('pointerup', stopDragging, { once: true })
  container.addEventListener('pointerleave', stopDragging, { once: true })
}

function updateHue(e) {
  const { width } = boundingClientRect.value
  hue.value = Math.max(0, Math.min(360, Math.round(e.offsetX / width * 360)))
}

function stopDragging() {
  window.removeEventListener('pointermove', updateHue)
  window.removeEventListener('pointerup', stopDragging)
  container.removeEventListener('pointerleave', stopDragging)
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
  background-color: var(--colorLayer0);
  outline: 2px solid var(--colorTextPrimary);
}
</style>
