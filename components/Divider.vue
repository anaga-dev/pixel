<script setup>
const props = defineProps({
  vertical: {
    type: Boolean
  },
  transparent: {
    type: Boolean
  }
})
</script>

<template>
  <div
    class="Divider"
    :class="{ vertical: props.vertical, transparent: props.transparent }"
  />
</template>

<style scoped>
.Divider {
  width: 100%;
  height: var(--space-xxs);
  background: var(--color-highlight);
}

.Divider.vertical {
  height: 100%;
  width: var(--space-xxs);
  background: var(--color-highlight);
}

.Divider.transparent {
  background: transparent;
}
</style>
