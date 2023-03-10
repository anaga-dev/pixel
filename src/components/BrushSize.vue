<template>
  <div class="brush-size">
    <label for="brush-size">Size {{ size }}px</label>
    <input id="brush-size" type="range" min="1" max="32" v-model="size" />
    <button type="button" class="pill" @click="$emit('select', size)">
      Ok
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  currentSize: {
    type: Number,
    required: true
  }
})

const size = ref(props.currentSize)
</script>

<style scoped>
.brush-size {
  position: fixed;
  top: 4rem;
  min-width: 16rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #2b2b2f;
  border-radius: 0.5rem;
  box-shadow:
    0 0 1px rgba(0, 0, 0, 0.1),
    0 0 2px rgba(0, 0, 0, 0.1),
    0 0 4px rgba(0, 0, 0, 0.1),
    0 0 8px rgba(0, 0, 0, 0.1),
    0 0 16px rgba(0, 0, 0, 0.1),
    0 0 32px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
