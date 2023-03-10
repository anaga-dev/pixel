<template>
  <div class="color-sliders">
    <div class="form-input">
      <label for="hue">hue</label>
      <input id="hue" type="range" min="0" max="360" :value="hue" @input="onInput('hue', $event.target.valueAsNumber)" />
    </div>
    <div class="form-input">
      <label for="saturation">saturation</label>
      <input id="saturation" type="range" min="0" max="100" :value="saturation" @input="onInput('saturation', $event.target.valueAsNumber)" />
    </div>
    <div class="form-input">
      <label for="lightness">lightness</label>
      <input id="lightness" type="range" min="0" max="100" :value="lightness" @input="onInput('lightness', $event.target.valueAsNumber)" />
    </div>
    <div class="form-input">
      <label for="red">red</label>
      <input id="red" type="range" min="0" max="255" :value="red" @input="onInput('red', $event.target.valueAsNumber)" />
    </div>
    <div class="form-input">
      <label for="green">green</label>
      <input id="green" type="range" min="0" max="255" :value="green" @input="onInput('green', $event.target.valueAsNumber)" />
    </div>
    <div class="form-input">
      <label for="blue">blue</label>
      <input id="blue" type="range" min="0" max="255" :value="blue" @input="onInput('blue', $event.target.valueAsNumber)" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Color from '../color/Color'

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

function updateFromRGB(r, g, b) {
  const color = Color.fromRGBA(r, g, b)
  hue.value = Color.hue(color)
  saturation.value = Color.saturation(color)
  lightness.value = Color.lightness(color)
}

function onInput(type, value) {
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
