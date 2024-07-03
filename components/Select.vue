<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="Select">
    <select
      :id="$attrs.id"
      :name="$attrs.id"
      :value="props.modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    >
      <slot />
    </select>
    <Icon
      i="arrow-down"
      class="icon"
    />
  </div>
</template>

<style scoped>
.Select {
  display: grid;
  grid-template-areas: "select";
}

select {
  padding-right: var(--space-xl);
}

.icon {
  justify-self: end;
  align-self: center;
  margin-right: var(--space-s);
  pointer-events: none;
}

select,
.icon {
  grid-area: select;
}
</style>
