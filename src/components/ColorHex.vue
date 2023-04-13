<template>
  <div class="ColorHex">
    <div class="hex-input">
      <span>#</span>
      <input
        id="hex"
        type="text"
        pattern="[A-Fa-f0-9]{6}"
        minlength="6"
        maxlength="6"
        v-model="hex" />
    </div>
    <div class="key-buttons">
      <Button v-for="key in [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']" :label="`Key ${key}`" :key="key" @click="onKeyButton(key)">{{ key}}</Button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/Button.vue'

const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})

const hex = ref('000000')

function onKeyButton(key) {
  // TODO:
}
</script>

<style scoped>
.hex-input {
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  align-items: center;
  gap: var(--spaceS);
}

input {
  text-transform: uppercase;
}
.key-buttons {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  display: none;
}

.key-button {
  padding: 1rem;
  font-size: 2rem;
  background: var(--colorShade);
}

.form-input {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

@media (hover: none) {
  .key-buttons {
    display: grid;
  }
}
</style>
