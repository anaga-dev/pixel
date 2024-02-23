<script setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  label: {
    type: [null, String],
    default: null
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
    type: [null, String],
    default: null
  },
  variant: {
    type: [null, String],
    default: null
  }
})
</script>

<template>
  <Tooltip
    :message="props.tooltipText"
    :position="props.tooltipPosition"
  >
    <Button
      :variant="props.variant === 'icon' ? 'ghost' : 'setting'"
      :label="props.label"
      :active="props.active"
      :disabled="props.disabled"
    >
      <Icon
        v-if="props.icon"
        :i="props.icon"
      />
      <span v-if="props.variant !== 'icon'">{{ $t(props.label) }}</span>
    </Button>
  </Tooltip>
</template>

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

@media (max-width: 1279px) {
  span {
    display: none;
  }
}
</style>
