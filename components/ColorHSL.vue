<template>
  <div class="ColorHSL">
    <Field :label="$t('studio.hue')" for="hue">
      <Slider id="hue" :min="0" :max="360" v-model="hue" />
    </Field>
    <Field :label="$t('studio.saturation')" for="saturation">
      <Slider id="saturation" :min="0" :max="100" v-model="saturation" />
    </Field>
    <Field :label="$t('studio.lightness')" for="lightness">
      <Slider id="lightness" :min="0" :max="100" v-model="lightness" />
    </Field>
  </div>
</template>

<script setup>
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
