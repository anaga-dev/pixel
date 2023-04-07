<template>
  <button type="button" :style="`color: ${color}`" @click.prevent="$emit('click')">
    <Icon i="color" />
  </button>
</template>

<script setup>
import Icon from '@/components/Icon.vue'

const emit = defineEmits(['click'])

const props = defineProps({
  color: {
    type: String,
    required: true
  }
})
</script>
