<template>
  <div class="button-wrap">
    <button
      :type="type"
      :aria-label="label"
      :aria-selected="active === true"
      :class="[variant, {active: active }]"
      :title="variant === 'ghost' ? label : ''">
      <slot></slot>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'button'
  },
  label: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    required: false,
    default: ''
  },
  active: {
    type: Boolean
  }
})
</script>

<style scoped>
.button-wrap {
  filter: drop-shadow(calc(var(--spaceS) * -1) var(--spaceS) 0 var(--colorShadow));
  transition: all 60ms ease;
}

button {
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  align-items: center;
  height: var(--spaceXL);
  gap: var(--spaceS);
  font-weight: bold;
  text-transform: uppercase;
  padding: 0 var(--spaceM);
  background-color: var(--colorShade);
  clip-path: var(--pixelCorners);
  transition: background-color 240ms ease, transform 60ms ease;
}

button:not(.ghost) {
  box-shadow: inset 0 calc(var(--spaceXS) * -1) 0 var(--colorShadow);
}

button:hover {
  background-color: var(--colorHover);
}

button.ghost {
  padding: var(--spaceS);
  background-color: transparent;
}

button.primary {
  color: var(--colorTextAlt);
  background-color: var(--colorAccent);
}

button.critical {
  background-color: var(--colorCritical);
}

button:active {
  transform: translate(calc(var(--spaceXS) * -1), var(--spaceXS));
}
</style>