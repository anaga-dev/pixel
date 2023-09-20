<template>
  <Dropdown class="BrushDither">
    <Button v-for="dither of patterns" :label="$t('studio.dither')" @click="$emit('select', dither)">
      <Icon :i="`dither-${dither}`" />
    </Button>
  </Dropdown>
</template>

<script setup>
const patterns = readonly(Array.of(0,1,2,3,4,5,6,7,8,9,10,11,12,13))
</script>

<style scoped>
.BrushDither {
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
