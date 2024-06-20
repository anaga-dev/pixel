<script setup>
const { t } = useI18n()

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'button'
  },
  label: {
    type: String,
    required: false,
    default: '',
  },
  variant: {
    type: String,
    required: false,
    default: '',
  },
  active: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  }
})

const localeLabel = computed(() => props.label ? t(props.label) : null)
</script>

<template>
  <div :class="{ 'button-wrap': props.variant !== 'ghost' }">
    <button
      :type="props.type"
      :aria-label="localeLabel"
      :aria-pressed="props.active"
      :class="[props.variant, { active: props.active }, { disabled: props.disabled }]"
    >
      <slot />
      <IconDropdown v-if="props.variant === 'dropdown' || props.variant === 'account'" />
    </button>
  </div>
</template>

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
