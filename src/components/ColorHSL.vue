<template>
  <div class="ColorHSL">
    <Field label="Hue" for="hue">
      <Slider id="hue" :min="0" :max="100" :data="hue" @update="onUpdate('hue', parseInt($event))" />
    </Field>
    <Field label="Saturation" for="saturation">
      <Slider id="saturation" :min="0" :max="100" :data="saturation" @update="onUpdate('saturation', parseInt($event))" />
    </Field>
    <Field label="Lightness" for="lightness">
      <Slider id="lightness" :min="0" :max="100" :data="lightness" @update="onUpdate('lightness', parseInt($event))" />
    </Field>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Color from '@/color/Color'
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
const hue = ref(Color.hue(parsedColor))
const saturation = ref(Color.saturation(parsedColor))
const lightness = ref(Color.lightness(parsedColor))
const red = ref(parsedColor[0] * 255)
const green = ref(parsedColor[1] * 255)
const blue = ref(parsedColor[2] * 255)

function updateFromHSL(h, s, l) {
  const [r, g, b] = Color.fromHSLA(h, s, l)
  red.value = r * 255
  green.value = g * 255
  blue.value = b * 255
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
  }
  emit('update:modelValue', `rgb(${red.value}, ${green.value}, ${blue.value})`)
}
</script>

<style scoped>
.ColorHSL {
  display: grid;
  grid-auto-flow: row;
  gap: var(--spaceL);
}
</style>