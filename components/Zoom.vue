<template>
  <section class="Zoom">
    <Button label="Zoom in" variant="dropdown" @click.stop="uiStore.toggleOverlay('zoom-settings')">
      <Icon i="zoom-in" />
    </Button>
  </section>
  <Dropdown v-if="uiStore.showOverlay === 'zoom-settings'" class="ZoomMenu" @close="uiStore.toggleOverlay('zoom-settings')">
    <Button label="Zoom in" @click="documentStore.zoom.increase()">
      <Icon i="zoom-in" />
      Zoom in
    </Button>
    <Button label="Zoom out" @click="documentStore.zoom.decrease()">
      <Icon i="zoom-out" />
      Zoom Out
    </Button>
    <Button label="Reset zoom" @click="documentStore.zoom.reset()">
      <Icon i="zoom-reset" />
      Reset zoom
    </Button>
  </Dropdown>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

function onZoomShow() {
  // TODO:
  console.info('TO BE IMPLEMENTED')
}
</script>

<style scoped>
.Zoom {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: var(--spaceS);
}

.percentage {
  width: 7ch;
  text-align: center;
}

.ZoomMenu {
  top: calc(var(--spaceS) + var(--widthToolbar));
}
</style>
