<template>
  <div class="Slider" :style="percent">
    <input
      :id="$attrs.id"
      type="range"
      :min="min"
      :step="step"
      :max="max"
      :value="data"
      @input="updateValue" />
    <input
      :id="`${$attrs.id}-number`"
      type="number"
      :step="step"
      :min="min"
      :max="max"
      :value="data"
      @input="updateValue" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Range from '~/math/Range'

const props = defineProps({
  data: {
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

const emit = defineEmits(['update'])

const sliderValue = ref(props.data)
const percent = ref({
  '--percent': `${Range.from(props.data, props.min, props.max) * 100}%`
})

function updateValue(e) {
  sliderValue.value = e.currentTarget.value
  emit('update', sliderValue.value)
}

watch(() => props.data, (newValue) => {
  percent.value['--percent'] = `${Range.from(newValue, props.min, props.max) * 100}%`
});
</script>

<style scoped>
.Slider {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spaceM);
}

input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  background-color: transparent;
  position: relative;
}

input[type=range]::-webkit-slider-runnable-track {
  background: var(--colorLayer0);
  height: var(--spaceS);
}

input[type=range]::-moz-range-track {
  background: var(--colorLayer0);
  height: var(--spaceS);
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  border-radius: 0;
  background-color: var(--colorAccent);
  width: var(--spaceL);
  aspect-ratio: 1;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  box-shadow: var(--shadowLayer);
}

input[type=range]::-moz-range-thumb {
  appearance: none;
  border: none;
  position: relative;
  border-radius: 0;
  background-color: var(--colorAccent);
  width: var(--spaceL);
  aspect-ratio: 1;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  box-shadow: var(--shadowLayer);
}

input[type="range"]::before {
  content: '';
  position: absolute;
  width: var(--percent, 100%);
  height: var(--spaceS);
  background: var(--colorAccent);
  pointer-events: none;
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
}
</style>
