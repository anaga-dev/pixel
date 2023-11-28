<template>
  <div
    class="PaletteColor"
    :class="{ active: active, remove: removeMode }"
    :style="{ backgroundColor: color.color }"
    @pointerover="handleOver"
    @click="handleClick">
  </div>
</template>

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

const removeMode = ref(false)

const emit = defineEmits(['select', 'remove'])

const handleClick = (e) => {
  if(e.ctrlKey) {
    emit('remove')
    return
  }
  emit('select', color)
}

const handleOver = (e) => {
  removeMode.value = documentStore.keys.current.has('control')
}
</script>

<style scoped>
.PaletteColor {
  aspect-ratio: 1;
}

.active {
  outline: 2px solid var(--colorTextPrimary);
}

.remove {
  cursor: url('@/assets/cursors/delete.svg') 12 12, auto;
}
</style>
