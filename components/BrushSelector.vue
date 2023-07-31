<template>
  <Dropdown class="BrushSelector">
    <Button label="Round brush" @click="$emit('select', 'round')">
      <Icon i="brush-round" />
      Round
    </Button>
    <Button label="Square brush" @click="$emit('select', 'square')">
      <Icon i="brush-square" />
      Square
    </Button>
    <Button label="Dither brush" @click="$emit('select', 'dither')">
      <Icon i="brush-dither" />
      Dither
    </Button>
  </Dropdown>
</template>

<style scoped>
.BrushSelector {
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
