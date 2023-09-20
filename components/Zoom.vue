<template>
  <section class="Zoom">
    <Button
      :label="$t('studio.zoom')"
      variant="dropdown"
      @click.stop="uiStore.toggleOverlay('zoom-settings')"
    >
      <Icon i="zoom-in" />
    </Button>
  </section>
  <Dropdown
    v-if="uiStore.showOverlay === 'zoom-settings'"
    class="ZoomMenu"
    @close="uiStore.toggleOverlay('zoom-settings')"
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

const documentStore = useDocumentStore()
const uiStore = useUIStore()
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
