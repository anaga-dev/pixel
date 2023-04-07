<template>
  <Dropdown class="BrushSize">
    <Field label="Brush size" for="brush-size">
      <Slider id="brush-size" :min="1" :max="32" :data="currentSize" @update="onUpdate" />
    </Field>
  </Dropdown>
</template>

<script setup>
import { ref } from 'vue'
import Dropdown from '@/components/Dropdown.vue'
import Field from '@/components/Field.vue'
import Slider from '@/components/Slider.vue'

const props = defineProps({
  currentSize: {
    type: Number,
    required: true
  }
})

const size = ref(props.currentSize)

const onUpdate = (e) => {
  size.value = e
}
</script>

<style scoped>
.BrushSize {
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
