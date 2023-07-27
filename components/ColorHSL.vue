<template>
  <div class="ColorHSL">
    <Field label="Hue" for="hue">
      <Slider id="hue" :min="0" :max="359" v-model="hue" />
    </Field>
    <Field label="Saturation" for="saturation">
      <Slider id="saturation" :min="0" :max="100" v-model="saturation" />
    </Field>
    <Field label="Lightness" for="lightness">
      <Slider id="lightness" :min="0" :max="100" v-model="lightness" />
    </Field>
  </div>
</template>

<script setup>
import Field from '@/components/Field.vue'
import Slider from '@/components/Slider.vue'

const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})

const { hue, saturation, lightness } = props.color
</script>

<style scoped>
.ColorHSL {
  display: grid;
  grid-auto-flow: row;
  gap: var(--spaceL);
}
</style>
