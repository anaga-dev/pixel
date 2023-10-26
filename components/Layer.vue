<template>
  <div
    class="Layer"
    draggable="true"
    :class="{
      active: active,
      invisible: !layer.visible.value,
      top: dropTop,
      bottom: dropBottom
    }"
    :data-index="index"
    @click="$emit('activate', layer)"
  >
    <div class="actions">
      <Button
        class="action"
        :label="$t('studio.layer-settings')"
        :active="settings"
        variant="ghost"
        @click.stop="$emit('settings', layer)"
      >
        <Icon i="settings" />
      </Button>
      <Button
        class="action"
        :label="
          layer.visible.value
            ? $t('studio.hide-layer')
            : $t('studio.show-layer')
        "
        variant="ghost"
        @click="$emit('visible', layer)"
      >
        <Icon :i="layer.visible.value ? 'visible' : 'hidden'" />
      </Button>
    </div>
    <div class="name">
      {{ layer.name.value }}
    </div>
    <!--
    <div class="collapse">
      <i class="bx bx-chevron-down"></i>
    </div>
    -->
    <div class="preview" ref="preview">
      <!-- Añadimos una vista del canvas -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  layer: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    required: false
  },
  settings: {
    type: Boolean,
    required: false
  },
  dropTop: {
    type: Boolean,
    required: false
  },
  dropBottom: {
    type: Boolean,
    required: false
  }
})

const preview = ref()

onMounted(() => preview.value.appendChild(props.layer.canvas))
</script>

<style scoped>
.Layer {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  position: relative;
}

.Layer.active {
  background-color: var(--colorAccent);
  color: var(--colorTextAlt);
}

.Layer.invisible {
  opacity: 0.5;
}

.actions {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
}

.name {
  font-weight: bold;
  padding: var(--spaceS);
}

.preview {
  display: grid;
  place-items: stretch;
  width: 4rem;
  aspect-ratio: 1;
  overflow: hidden;
  background: url('@/assets/checkers.png');
}

.top::after {
  content: '';
  position: absolute;
  width: 100%;
  top: -2px;
  height: 4px;
  left: 0;
  background-color: var(--colorAccent);
}

.bottom::after {
  content: '';
  position: absolute;
  width: 100%;
  bottom: -2px;
  height: 4px;
  left: 0;
  background-color: var(--colorAccent);
}

canvas {
  width: 100%;
  height: auto;
}
</style>
