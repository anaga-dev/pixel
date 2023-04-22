<template>
  <Dropdown class="BrushSize">
    <Field label="Brush size" for="brush-size">
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
import Dropdown from '@/components/Dropdown.vue'
import Field from '@/components/Field.vue'
import Slider from '@/components/Slider.vue'

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
  console.log('updated!!!', payload)
  emit('update', payload)
}
</script>

<style scoped>
.BrushSize {
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
