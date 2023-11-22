<template>
  <section class="Zoom">
    <Button
      :label="$t('studio.zoom')"
      variant="ghost"
      @click.stop="toggleOverlay('zoom-settings')"
    >
      <Icon i="zoom-in" />
    </Button>
  </section>
  <Dropdown
    v-if="showOverlay === 'zoom-settings'"
    class="ZoomMenu"
    @close="toggleOverlay('zoom-settings')"
  >
    <Button
      :label="$t('studio.zoom-in')"
      @click="documentStore.zoom.increase()"
    >
      <Icon i="zoom-in" />
      {{ $t('studio.zoom-in') }}
    </Button>
    <Button
      :label="$t('studio.zoom-out')"
      @click="documentStore.zoom.decrease()"
    >
      <Icon i="zoom-out" />
      {{ $t('studio.zoom-out') }}
    </Button>
    <Button
      :label="$t('studio.zoom-reset')"
      @click="documentStore.zoom.reset()"
    >
      <Icon i="zoom-reset" />
      {{ $t('studio.zoom-reset') }}
    </Button>
  </Dropdown>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const { showOverlay } = storeToRefs(uiStore)
const { toggleOverlay } = uiStore
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
  bottom: 0;
  right: var(--widthToolbar);
}

@media (max-width: 1024px) {
  .Zoom {
    display: none;
  }
}
</style>
