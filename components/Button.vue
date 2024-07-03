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
    calc(var(--space-s) * -1) var(--space-s) 0 var(--color-shadow)
  );
  transition: all 60ms ease;
}

button {
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  align-items: center;
  gap: var(--space-s);
  font-weight: bold;
  line-height: 24px;
  padding: var(--space-s) var(--space-m);
  background-color: var(--color-highlight);
  clip-path: var(--clip-corners);
  transition: background-color 240ms ease, transform 60ms ease;
}

button.ghost {
  padding: var(--space-s);
  background-color: transparent;
  color: inherit;
}

button:is(.dropdown, .setting) {
  background-color: transparent;
}

button:is(.ghost, .dropdown).active {
  color: var(--color-brand);
}

button.primary {
  --color-base-100: var(--color-base-950);
  background-color: var(--color-brand);
}

button.critical {
  color: var(--color-base-50);
  background-color: var(--color-critical);
}

button:is(:not(.ghost, .dropdown, .primary, .critical)):hover {
  background-color: var(--color-base-600);
}

button.ghost:hover {
  background-color: var(--color-highlight);
}

button.account {
  background-color: transparent;
}

button:is(.dropdown, .setting) {
  background-color: var(--color-base-900);
}

button:is(.dropdown, .setting):hover {
  background-color: var(--color-base-800);
}

button:active {
  transform: translate(0, var(--space-xs));
}

button.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
