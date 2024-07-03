<script setup>
const emit = defineEmits(['select'])
</script>

<template>
  <Dropdown class="BrushSelector">
    <Button
      :label="$t('studio.round')"
      @click="emit('select', 'round')"
    >
      <Icon i="brush-round" />
      {{ $t('studio.round') }}
    </Button>
    <Button
      :label="$t('studio.square')"
      @click="emit('select', 'square')"
    >
      <Icon i="brush-square" />
      {{ $t('studio.square') }}
    </Button>
    <Button
      :label="$t('studio.dither')"
      @click="emit('select', 'dither')"
    >
      <Icon i="brush-dither" />
      {{ $t('studio.dither') }}
    </Button>
  </Dropdown>
</template>

<style scoped>
.BrushSelector {
  top: calc(var(--size-toolbar) + var(--space-s));
}
</style>
