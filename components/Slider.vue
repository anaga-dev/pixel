<template>
  <div
    class="Slider"
    :style="style"
  >
    <input
      :id="$attrs.id"
      type="range"
      :min="min"
      :step="step"
      :max="max"
      :value="modelValue"
      @input="updateValue"
    >
    <input
      :id="`${$attrs.id}-number`"
      type="number"
      :step="step"
      :min="min"
      :max="max"
      :value="modelValue"
      @input="updateValue"
    >
  </div>
</template>

<script setup>
import Range from '@/pixel/math/Range'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:modelValue'])

const style = computed(() => ({
  '--percent': `${Range.from(props.modelValue, props.min, props.max) * 100}%`
}))

function updateValue(e) {
  emit('update:modelValue', parseInt(e.target.value))
}

watch(() => props.data, (newValue) => {
  percent.value['--percent'] = `${Range.from(newValue, props.min, props.max) * 100}%`
})
</script>

<style scoped>
.Slider {
  display: grid;
  grid-template-columns: 1fr 5rem;
  gap: var(--space-m);
}

input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  background-color: transparent;
  position: relative;
}

input[type=range]::-webkit-slider-runnable-track {
  background: var(--color-base-950);
  height: var(--space-s);
}

input[type=range]::-moz-range-track {
  background: var(--color-base-950);
  height: var(--space-s);
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  border-radius: 0;
  background-color: var(--color-brand);
  width: var(--space-l);
  aspect-ratio: 1;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  box-shadow: var(--shadow-floating-element);
}

input[type=range]::-moz-range-thumb {
  appearance: none;
  border: none;
  position: relative;
  border-radius: 0;
  background-color: var(--color-brand);
  width: var(--space-l);
  height: var(--space-l);
  aspect-ratio: 1;
  top: 50%;
  z-index: 2;
  box-shadow: var(--shadow-floating-element);
}

/* input[type="range"]::before {
  content: '';
  position: absolute;
  width: var(--percent, 100%);
  max-width: 100%;
  height: var(--space-l);
  background: var(--color-brand);
  pointer-events: none;
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: var(--shadow-floating-element);
}
 */
 </style>
