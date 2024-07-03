<script setup>
import { useDocumentStore } from '@/stores/document'
const documentStore = useDocumentStore()

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

const emit = defineEmits(['activate', 'settings', 'visible'])

const preview = ref()
const input = ref(null)
const editLayerName = ref()
const layerName = ref(unref(props.layer.name))

onClickOutside(input, (e) => {
  e.stopPropagation()
  editLayerName.value = false
})

function onToggleLayerNameEdit() {
  editLayerName.value = true
}

function onKeyDown(e) {
  if (e.key === 'Enter') {
    documentStore.changeLayerName(props.layer, layerName.value)
    editLayerName.value = false
  }
  if (e.key === 'Escape') {
    layerName.value = props.layer.name
    editLayerName.value = false
  }
}

onMounted(() => preview.value.appendChild(props.layer.canvas))
</script>

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
    @click.prevent="emit('activate', layer)"
  >
    <div class="actions">
      <Button
        class="action"
        :label="$t('studio.layer-settings')"
        :active="settings"
        variant="ghost"
        @click.stop="emit('settings', layer)"
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
        @click.prevent="emit('visible', layer)"
      >
        <Icon :i="layer.visible.value ? 'visible' : 'hidden'" />
      </Button>
    </div>
    <div
      v-if="!editLayerName"
      class="name"
      @dblclick="onToggleLayerNameEdit"
    >
      {{ layer.name.value }}
    </div>
    <input
      v-else
      ref="input"
      v-model="layerName"
      v-focus
      class="input-name"
      type="text"
      @keydown="onKeyDown"
    >
    <!--
    <div class="collapse">
      <i class="bx bx-chevron-down"></i>
    </div>
    -->
    <div
      ref="preview"
      class="preview"
    >
      <!-- Añadimos una vista del canvas -->
    </div>
  </div>
</template>

<style scoped>
.Layer {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  position: relative;
}

.Layer.active {
  background-color: var(--color-brand);
  color: var(--color-base-950);
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
  padding: var(--space-s);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.input-name {
  width: 100%;
  color: var(--color-base-50);
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
  background-color: var(--color-brand);
}

.bottom::after {
  content: '';
  position: absolute;
  width: 100%;
  bottom: -2px;
  height: 4px;
  left: 0;
  background-color: var(--color-brand);
}

canvas {
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>
