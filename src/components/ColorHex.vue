<template>
  <div class="color-hex">
    <div class="form-input">
      <label for="hex">#</label>
      <input
        id="hex"
        ref="hex"
        type="text"
        pattern="[A-Fa-f0-9]{6}"
        minlength="6"
        maxlength="6"
        v-model="modelValue" />
    </div>
    <div class="key-buttons">
      <Button class="key-button" v-for="key in [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']" :key="key" @click="onKeyButton(key)">{{ key}}</Button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import Range from '~/math/Range.js'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const hex = ref()

function onKeyButton(key) {
  // TODO: Necesitamos controlar los valores
  // de hex.value.selectionStart y hex.value.selectionEnd
  // para poder insertar el valor en la posición correcta
  const newValue = props.modelValue + key
  emit('update:modelValue', newValue.slice(0, 6).toUpperCase())
  hex.value.focus()
}
</script>

<style scoped>
.key-buttons {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  display: grid;
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
</style>
