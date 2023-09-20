<template>
  <Dropdown class="BrushSize">
    <Field :label="$t('studio.brush-size')" for="brush-size">
      <Slider
        id="brush-size"
        :min="1"
        :max="32"
        :modelValue="size"
        @update:modelValue="onUpdated" />
    </Field>
  </Dropdown>
</template>

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

<style scoped>
.BrushSize {
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
