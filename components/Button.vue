<template>
  <div :class="{ 'button-wrap': variant !== 'ghost' }">
    <button
      :type="type"
      :aria-label="label"
      :aria-selected="active === true"
      :class="[variant, { active: active }, { disabled: disabled }]"
    >
      <slot></slot>
      <IconDropdown v-if="variant === 'dropdown' || variant === 'account'" />
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
    required: false
  },
  variant: {
    type: String,
    required: false,
    default: ''
  },
  active: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  }
})
</script>

<style scoped>
.button-wrap {
  filter: drop-shadow(
    calc(var(--spaceS) * -1) var(--spaceS) 0 var(--colorShadow)
  );
  transition: all 60ms ease;
}

button {
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  align-items: center;
  gap: var(--spaceS);
  font-weight: bold;
  line-height: 24px;
  text-transform: uppercase;
  padding: var(--spaceS) var(--spaceM);
  background-color: var(--colorShade);
  clip-path: var(--pixelCorners);
  transition: background-color 240ms ease, transform 60ms ease;
}

button.ghost {
  padding: var(--spaceS);
  background-color: transparent;
  color: inherit;
}

button:is(.dropdown, .setting) {
  background-color: transparent;
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

button.ghost:hover {
  background-color: var(--colorShade);
}

button.account {
  background-color: transparent;
}

button:is(.dropdown, .setting) {
  background-color: var(--colorLayer1);
}

button:is(.dropdown, .setting):hover {
  background-color: var(--colorLayer2);
}

button:active {
  transform: translate(0, var(--spaceXS));
}

button.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
