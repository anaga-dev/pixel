<template>
  <div class="ColorHex">
    <div class="hex-input">
      <span>#</span>
      <input
        id="hex"
        ref="hex"
        type="text"
        pattern="[A-Fa-f0-9]{6}"
        minlength="6"
        maxlength="6"
        v-model="hexValue" />
    </div>
    <div class="key-buttons">
      <Button v-for="key in [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']" :label="`Key ${key}`" :key="key" @click="onKeyButton(key)">{{ key}}</Button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import Button from '@/components/Button.vue'
import Color from '@/color/Color'
// import Range from '~/math/Range.js'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const hexValue = computed({
  get() {
    return Color.stringify(Color.parse(props.modelValue), 'hex').slice(1, 7)
  },
  set(value) {
    emit('update:modelValue', Color.stringify(Color.parse(value), 'rgb'))
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
