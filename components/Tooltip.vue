<script setup>
import { useUIStore } from '@/stores/ui'
const uiStore = useUIStore()

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: false,
    default: 'bottom'
  }
})
</script>

<template>
  <div class="tooltip-container">
    <div class="Tooltip" :class="[position]">{{ message }}</div>
    <slot></slot>
  </div>
</template>

<style scoped>
.tooltip-container {
  position: relative;
}
.Tooltip {
  position: absolute;
  padding: var(--spaceM) var(--spaceL);
  background-color: var(--colorLayer2);
  box-shadow: var(--shadowLayer);
  z-index: 1000;
  pointer-events: none;
  visibility: hidden;
  transition: all 240ms ease;
  scale: 0.2;
  opacity: 0;
  width: max-content;
}

.Tooltip.top {
  bottom: calc(100% + var(--spaceS));
  left: 50%;
  translate: -50% 0;
}

.Tooltip.bottom {
  top: calc(100% + var(--spaceS));
  left: 50%;
  translate: -50% 0;
}

.Tooltip.left {
  top: 50%;
  translate: 0 -50%;
  right: calc(100% + var(--spaceS));
}

.Tooltip.right {
  top: 50%;
  translate: 0 -50%;
  left: calc(100% + var(--spaceS));
}

.Tooltip.left.bottom {
  top: calc(100% + var(--spaceS));
  left: auto;
  right: 0;
  translate: 0 0;
}

.Tooltip.right.bottom {
  top: calc(100% + var(--spaceS));
  left: 0;
  right: auto;
  translate: 0 0;
}

.tooltip-container:hover .Tooltip {
  visibility: visible;
  opacity: 1;
  scale: 1;
  transition-delay: 500ms;
}

.tooltip-container:hover .Tooltip.right {
  transform-origin: left center;
}

.tooltip-container:hover .Tooltip.left {
  transform-origin: right center;
}
</style>
