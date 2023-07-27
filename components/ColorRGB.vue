<template>
  <div class="ColorRGB">
    <Field label="Red" for="red">
      <Slider id="red" :min="0" :max="255" v-model="red" />
    </Field>
    <Field label="Green" for="green">
      <Slider id="green" :min="0" :max="255" v-model="green" />
    </Field>
    <Field label="Blue" for="blue">
      <Slider id="blue" :min="0" :max="255" v-model="blue" />
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

const { red, green, blue } = props.color
</script>

<style scoped>
.ColorRGB {
  display: grid;
  grid-auto-flow: row;
  gap: var(--spaceL);
}
</style>
