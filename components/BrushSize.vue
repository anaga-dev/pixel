<script setup>
const props = defineProps({
  size: {
    type: Number,
    required: true
  }
})

const emit = defineEmits([
  'update'
])

function onUpdated(payload) {
  emit('update', payload)
}
</script>

<template>
  <Dropdown class="BrushSize">
    <Field
      :label="$t('studio.brush-size')"
      for="brush-size"
    >
      <Slider
        id="brush-size"
        :min="1"
        :max="32"
        :model-value="props.size"
        @update:model-value="onUpdated"
      />
    </Field>
  </Dropdown>
</template>

<style scoped>
.BrushSize {
  top: calc(var(--size-toolbar) + var(--space-s));
}
</style>
