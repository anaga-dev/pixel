<template>
  <div :class="{ 'button-wrap': variant !== 'ghost' }">
    <button
      :type="type"
      :aria-label="label"
      :aria-selected="active === true"
      :class="[variant, {active: active }]"
      :title="variant === 'ghost' ? label : ''">
      <slot></slot>
      <IconDropdown v-if="variant === 'dropdown'" />
    </button>
  </div>
</template>

<script setup>
import IconDropdown from '@/components/IconDropdown.vue';

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'button'
  },
  label: {
    type: String,
    required: false
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

button:is(.ghost, .dropdown) {
  padding: var(--spaceS);
  background-color: transparent;
  color: inherit;
}

button:is(.ghost, .dropdown).active {
  color: var(--colorAccent);
}

button.primary {
  color: var(--colorTextAlt);
  background-color: var(--colorAccent);
}

button.critical {
  color: var(--colorTextPrimary);
  background-color: var(--colorCritical);
}

button:is(:not(.ghost, .dropdown, .primary, .critical)):hover {
  background-color: var(--colorHover);
}

button:is(.ghost, .dropdown):hover {
  background-color: var(--colorShade);
}

button:active {
  transform: translate(calc(var(--spaceXS) * -1), var(--spaceXS));
}
</style>