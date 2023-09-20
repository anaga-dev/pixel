<template>
  <div class="ColorRGB">
    <Field :label="$t('red')" for="red">
      <Slider id="red" :min="0" :max="255" v-model="red" />
    </Field>
    <Field :label="$t('green')" for="green">
      <Slider id="green" :min="0" :max="255" v-model="green" />
    </Field>
    <Field :label="$t('blue')" for="blue">
      <Slider id="blue" :min="0" :max="255" v-model="blue" />
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

const { red, green, blue } = props.color
</script>

<style scoped>
.ColorRGB {
  display: grid;
  grid-auto-flow: row;
  gap: var(--spaceL);
}
</style>
