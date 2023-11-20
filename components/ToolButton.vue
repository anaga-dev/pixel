<template>
  <Tooltip :message="tooltipText" :position="tooltipPosition">
    <Button
      variant="ghost"
      :class="[variant]"
      :label="label"
      :active="active"
      :disabled="disabled"
    >
      <Icon v-if="icon" :i="icon" />
      <span>{{ $t(label) }}</span>
    </Button>
  </Tooltip>
</template>

<script setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: false
  },
  tooltipText: {
    type: String,
    required: true
  },
  tooltipPosition: {
    type: String,
    default: 'bottom'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    required: false
  },
  variant: {
    type: String,
    required: false
  }
})
</script>

<style scoped>
button {
  display: grid;
  place-content: center;
  height: var(--spaceXL);
  padding: 0 var(--spaceS);
  background-color: transparent;
  clip-path: var(--pixelCorners);
  transition: all 240ms ease;
}

button:hover {
  background-color: var(--colorShade);
}

.icon span {
  display: none;
}

@media (max-width: 768px) {
  button {
    padding: 0;
  }

  .icon span {
    display: block;
  }
}

@media (max-width: 1023px) {
  span {
    display: none;
  }
}
</style>
