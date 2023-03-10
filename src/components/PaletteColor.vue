<template>
  <div class="color" :class="{ active: active }" :style="{ backgroundColor: color }" @click="$emit('select', color)"></div>
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
  }
})
</script>

<style scoped>
.color {
  border: 1px solid #000;
  width: 2rem;
  height: 2rem;
}

.active {
  border: 1px solid #fff;
}
</style>
