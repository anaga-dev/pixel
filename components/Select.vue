<template>
  <div class="Select">
    <select
      :name="$attrs.id"
      :id="$attrs.id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
      <slot></slot>
    </select>
    <Icon i="arrow-down" class="icon" />
  </div>
</template>

<script setup>
const props = defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<style scoped>
.Select {
  display: grid;
  grid-template-areas: "select";
}

select {
  padding-right: var(--spaceXL);
}

.icon {
  justify-self: end;
  align-self: center;
  margin-right: var(--spaceS);
  pointer-events: none;
}

select,
.icon {
  grid-area: select;
}
</style>
