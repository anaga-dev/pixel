<template>
  <div
    class="PaletteColor"
    :class="{ active: active }"
    :style="{ backgroundColor: color }"
    :data-index="index"
    @click="$emit('select', color)">
  </div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: false,
    default: false
  },
  index: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.PaletteColor {
  aspect-ratio: 1;
}

.active {
  outline: 2px solid var(--colorTextPrimary);
}
</style>
