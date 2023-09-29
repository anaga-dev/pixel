<template>
  <button type="button" :style="`color: ${color}`" @click.stop="$emit('click')">
    <Icon class="outline" :class="{ active: active }" i="color-outline" />
    <Icon class="color" i="color" />
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

<style scoped>
button {
  display: grid;
}

.color,
.outline {
  grid-column: 1;
  grid-row: 1;
}

.outline:not(.active) {
  color: var(--colorTextSecondary);
}
.active {
  color: var(--colorAccent);
}
</style>
