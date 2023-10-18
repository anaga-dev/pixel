<template>
  <Button variant="ghost" :style="`color: ${color}`" @click.stop="$emit('click')">
    <Icon class="outline" i="color-outline" />
    <Icon class="color" i="color" />
  </Button>
</template>

<script setup>
const emit = defineEmits(['click'])

const props = defineProps({
  color: {
    type: String,
    required: true
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

.outline {
  color: var(--colorText);
}
</style>
