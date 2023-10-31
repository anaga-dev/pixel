<template>
  <div
    class="PaletteColor"
    :class="{ active: active }"
    :style="{ backgroundColor: color }"
    :data-index="index"
    @click="handleClick">
  </div>
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
  },
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['select', 'remove'])

const handleClick = (e) => {
  if(e.ctrlKey) {
    emit('remove', props.index)
    return
  }
  emit('select', color)
}
</script>

<style scoped>
.PaletteColor {
  aspect-ratio: 1;
}

.active {
  outline: 2px solid var(--colorTextPrimary);
}
</style>
