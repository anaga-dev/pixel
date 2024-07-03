<template>
  <div class="ColorHSL">
    <Field
      :label="$t('studio.hue')"
      for="hue"
    >
      <Slider
        id="hue"
        v-model="hue"
        :min="0"
        :max="360"
      />
    </Field>
    <Field
      :label="$t('studio.saturation')"
      for="saturation"
    >
      <Slider
        id="saturation"
        v-model="saturation"
        :min="0"
        :max="100"
      />
    </Field>
    <Field
      :label="$t('studio.lightness')"
      for="lightness"
    >
      <Slider
        id="lightness"
        v-model="lightness"
        :min="0"
        :max="100"
      />
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
  gap: var(--space-l);
}
</style>
