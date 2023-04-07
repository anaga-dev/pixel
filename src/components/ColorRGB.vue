<template>
  <div class="ColorRGB">
    <Field label="Red" for="red">
      <Slider id="red" :min="0" :max="255" :data="red" @update="onUpdate('red', parseInt($event))" />
    </Field>
    <Field label="Green" for="green">
      <Slider id="green" :min="0" :max="255" :data="green" @update="onUpdate('green', parseInt($event))" />
    </Field>
    <Field label="Blue" for="blue">
      <Slider id="blue" :min="0" :max="255" :data="blue" @update="onUpdate('blue', parseInt($event))" />
    </Field>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Color from '@/color/Color'
import Field from '@/components/Field.vue'
import Slider from '@/components/Slider.vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const parsedColor = Color.parse(props.modelValue)
const red = ref(parsedColor[0] * 255)
const green = ref(parsedColor[1] * 255)
const blue = ref(parsedColor[2] * 255)

function updateFromRGB(r, g, b) {
  const color = Color.fromRGBA(r, g, b)
  hue.value = Color.hue(color)
  saturation.value = Color.saturation(color)
  lightness.value = Color.lightness(color)
}

function onUpdate(type, value) {
  switch (type) {
    case 'red':
      red.value = value;
      updateFromRGB(red.value, green.value, blue.value)
      break
    case 'green':
      green.value = value;
      updateFromRGB(red.value, green.value, blue.value)
      break
    case 'blue':
      blue.value = value;
      updateFromRGB(red.value, green.value, blue.value)
      break
  }
  emit('update:modelValue', `rgb(${red.value}, ${green.value}, ${blue.value})`)
}
</script>

<style scoped>
.ColorRGB {
  display: grid;
  grid-auto-flow: row;
  gap: var(--spaceL);
}
</style>
