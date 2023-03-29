<template>
  <div class="color-sliders">
    <Field label="Hue" for="hue">
      <Slider id="hue" :min="0" :max="359" :data="hue" @update="onUpdate('hue', parseInt($event))" />
    </Field>
    <Field label="Saturation" for="saturation">
      <Slider id="saturation" :min="0" :max="100" :data="saturation" @update="onUpdate('saturation', parseInt($event))" />
    </Field>
    <Field label="Lightness" for="lightness">
      <Slider id="lightness" :min="0" :max="100" :data="lightness" @update="onUpdate('lightness', parseInt($event))" />
    </Field>
    <Divider />
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
import Divider from '@components/Divider.vue'
import Field from '@components/Field.vue'
import Slider from '@components/Slider.vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const parsedColor = Color.parse(props.modelValue)
const [r, g, b] = parsedColor

const hue = ref(Color.hue(parsedColor))
const saturation = ref(Color.saturation(parsedColor) * 100)
const lightness = ref(Color.lightness(parsedColor) * 100)
const red = ref(r * 255)
const green = ref(g * 255)
const blue = ref(b * 255)

function updateFromHSL(h, s, l) {
  const [r, g, b] = Color.fromHSLA(h, s, l)
  red.value = Math.round(r * 255)
  green.value = Math.round(g * 255)
  blue.value = Math.round(b * 255)
}

function updateFromRGB(r, g, b) {
  const color = Color.fromRGBA(r, g, b)
  hue.value = Math.round(Color.hue(color))
  saturation.value = Math.round(Color.saturation(color) * 100)
  lightness.value = Math.round(Color.lightness(color) * 100)
}

function onUpdate(type, value) {
  switch (type) {
    case 'hue':
      hue.value = value;
      updateFromHSL(hue.value, saturation.value, lightness.value)
      break
    case 'saturation':
      saturation.value = value;
      updateFromHSL(hue.value, saturation.value, lightness.value)
      break
    case 'lightness':
      lightness.value = value;
      updateFromHSL(hue.value, saturation.value, lightness.value)
      break
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
.color-sliders {
  display: grid;
  grid-auto-flow: row;
  gap: var(--spaceL);
}
</style>
