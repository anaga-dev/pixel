<template>
  <div class="palette">
    <PaletteColor
      v-for="(color, index) in palette"
      :key="index"
      :color="color"
      :active="selectedColor === color"
      @select="$emit('select', color)"
    />
  </div>
</template>

<script setup>
import PaletteColor from './PaletteColor.vue'

const props = defineProps({
  palette: {
    type: Array,
    required: true
  },
  selectedColor: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.palette {
  display: flex;
  flex-wrap: wrap;
}
</style>
