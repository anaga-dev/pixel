<script setup>
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const { toggleColorPicker } = uiStore

const props = defineProps({
  color: {
    type: String,
    required: true
  }
})
</script>

<template>
  <Button
    variant="ghost"
    :style="{ color: props.color }"
    @click.stop="toggleColorPicker()"
  >
    <Icon
      class="outline"
      i="color-outline"
    />
    <Icon
      class="color"
      i="color"
    />
  </Button>
</template>

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
  color: var(--color-base-100);
}
</style>
