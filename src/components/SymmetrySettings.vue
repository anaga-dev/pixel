<template>
  <div class="symmetry-settings">
    <div class="enabled">
      <input id="enabled" type="checkbox" v-model="enabled" />
      <label for="enabled">Symmetry</label>
      <!-- TODO: Convertir esto en un switch -->
    </div>
    <div class="axis">
      <button type="button" :class="{ active: axis === 'horizontal' }" @click="axis = 'horizontal'">
        <i class="bx bx-collapse-horizontal"></i> Horizontal
      </button>
      <button type="button" :class="{ active: axis === 'vertical' }" @click="axis = 'vertical'">
        <i class="bx bx-collapse-vertical"></i> Vertical
      </button>
      <button type="button" :class="{ active: axis === 'both' }" @click="axis = 'both'">
        <i class="bx bx-collapse-alt"></i> Both
      </button>
    </div>
    <button type="button" class="pill" @click="onOk">
      Ok
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDocumentStore } from '../stores/PixelDocument'

const document = useDocumentStore()

const enabled = ref(document.symmetry.enabled)
const axis = ref(document.symmetry.axis)

function onOk() {
  document.setSymmetrySettings(enabled, axis)
}
</script>

<style scoped>
.symmetry-settings {
  position: fixed;
  top: 8rem;
  left: 4rem;
  width: 12rem;
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

.enabled {
  display: flex;
  gap: 0.5rem;
}

.axis {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 1rem;
}
</style>
