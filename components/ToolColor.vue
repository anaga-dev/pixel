<template>
  <button type="button" :style="`color: ${color}`" @click.stop="$emit('click')">
    <Icon i="color" />
  </button>
</template>

<script setup>
const emit = defineEmits(['click'])

const props = defineProps({
  color: {
    type: String,
    required: true
  },
  active: {
    type: Boolean
  }
})
</script>
