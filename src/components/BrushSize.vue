<template>
  <Dropdown class="BrushSize">
    <Field label="Brush size" for="brush-size">
      <Slider id="brush-size" :min="1" :max="32" v-model="currentSize" />
    </Field>
  </Dropdown>
</template>

<script setup>
import Dropdown from '@/components/Dropdown.vue'
import Field from '@/components/Field.vue'
import Slider from '@/components/Slider.vue'

const props = defineProps({
  currentSize: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.BrushSize {
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
