<script setup>
import { useDocumentStore } from '@/stores/document'
const documentStore = useDocumentStore()

const props = defineProps({
  color: {
    type: Object,
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

const emit = defineEmits(['select', 'remove'])

const handleClick = (e) => {
  if(e.ctrlKey) {
    emit('remove')
    return
  }
  emit('select', color)
}
</script>

<template>
  <div
    class="PaletteColor"
    :class="{ active: active }"
    :style="{ backgroundColor: color.color }"
    @pointerover="handleOver"
    @pointerdown="handleClick">
  </div>
</template>

<style scoped>
.PaletteColor {
  aspect-ratio: 1;
}

.active {
  outline: 2px solid var(--colorTextPrimary);
}
</style>
