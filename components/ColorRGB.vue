<script setup>
const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})

const { red, green, blue } = props.color
</script>

<template>
  <div class="ColorRGB">
    <Field
      :label="$t('red')"
      for="red"
    >
      <Slider
        id="red"
        v-model="red"
        :min="0"
        :max="255"
      />
    </Field>
    <Field
      :label="$t('green')"
      for="green"
    >
      <Slider
        id="green"
        v-model="green"
        :min="0"
        :max="255"
      />
    </Field>
    <Field
      :label="$t('blue')"
      for="blue"
    >
      <Slider
        id="blue"
        v-model="blue"
        :min="0"
        :max="255"
      />
    </Field>
  </div>
</template>

<style scoped>
.ColorRGB {
  display: grid;
  grid-auto-flow: row;
  gap: var(--space-l);
}
</style>
