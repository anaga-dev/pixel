<template>
  <div class="ColorHex">
    <div class="hex-input">
      <span>#</span>
      <input
        v-if="!isTouch"
        class="hex"
        type="text"
        pattern="[A-Fa-f0-9]{6}"
        minlength="6"
        maxlength="6"
        :value="hexColor"
        @input="onInput" />
      <div class="hex" v-else>
        {{ hexColor }}
      </div>
    </div>
    <div class="key-buttons">
      <Button v-for="key in [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']" :label="`Key ${key}`" :key="key" @click="onKeyButton(key)">{{ key}}</Button>
    </div>
  </div>
</template>

<script setup>
import { rgbToHex, hexToRgb } from '@/pixel/color/ColorConverter'

const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'update'
])

const hexColor = computed(() => rgbToHex(red.value, green.value, blue.value))
const isTouch = computed(() => navigator.maxTouchPoints > 0)
const { red, green, blue } = props.color

onMounted(() => {
  if (!isTouch) {
    hex.value.focus()
  }
})

function onInput(e) {
  const hexRegex = /^#?([0-9A-Fa-f]{6})$/
  if (hexRegex.test(e.target.value)) {
    emit('update', hexToRgb(e.target.value))
  }
}

let index = 0
function onKeyButton(key) {
  const hex = hexColor.value
  const newHex = hex.slice(0, index) + key + hex.slice(index + 1)
  index++
  if (index > 5) {
    index = 0
  }
  emit('update', hexToRgb(newHex))
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

.hex {
  text-transform: uppercase;
  font-weight: bold;
  appearance: none;
  border: none;
  height: var(--spaceXL);
  display: grid;
  align-items: center;
  padding: 0 var(--spaceS);
  background-color: var(--colorLayer0);
  color: var(--colorPrimary);
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
