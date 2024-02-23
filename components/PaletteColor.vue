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
  if (e.ctrlKey) {
    emit('remove')
    return
  }
  emit('select', color)
}

const handleOver = () => {
  removeMode.value = documentStore.keys.current.has('control')
}
</script>

<template>
  <div
    class="PaletteColor"
    :class="{ active: props.active, remove: removeMode }"
    :style="{ backgroundColor: props.color.color }"
    @pointerover="handleOver"
    @click="handleClick"
  />
</template>

<style scoped>
.PaletteColor {
  aspect-ratio: 1;
}

.active {
  outline: 2px solid var(--colorTextPrimary);
}
</style>
