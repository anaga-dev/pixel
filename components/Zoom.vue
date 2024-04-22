<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'

const documentStore = useDocumentStore()
const uiStore = useUIStore()
</script>

<template>
  <section class="Zoom">
    <Tooltip message="studio.tooltips.zoom" position="left bottom">
      <Button
        :label="$t('studio.zoom')"
        variant="ghost"
        @click.stop="uiStore.toggleOverlay('zoom-settings')"
      >
        <Icon i="zoom-in" />
      </Button>
    </Tooltip>
    <Dropdown
      v-if="uiStore.showOverlay === 'zoom-settings'"
      class="ZoomMenu"
      @close="toggleOverlay('zoom-settings')"
    >
      <h3>{{ $t('studio.zoom') }}</h3>
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
  </section>
</template>

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
</style>
