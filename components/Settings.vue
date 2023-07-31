<template>
  <section class="Settings">
    <div class="group">
      <SettingsButton />
      <Divider vertical />
      <ToolSettings :tool="documentStore.tool" />
    </div>
    <div class="group">
      <Button
      label="Symmetry aid"
      variant="dropdown"
      :active="documentStore.symmetry.axis !== null"
      @click="uiStore.toggleOverlay('symmetry-settings')">
        <Icon i="symmetry-vertical" v-if="documentStore.symmetry.axis === 'vertical'" />
        <Icon i="symmetry-two-axis" v-else-if="documentStore.symmetry.axis === 'both'" />
        <Icon i="symmetry-horizontal" v-else />
      </Button>
      <Zoom />
      <Divider vertical />
      <ToolColor :color="documentStore.color" @click="uiStore.togglePanel('color-picker')"></ToolColor>
      <Button
        variant="ghost"
        :active="uiStore.isShowingLayersPanel"
        @click="uiStore.togglePanel('layers')">
        <Icon i="layers" />
      </Button>
    </div>
  </section>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'
import SettingsButton from '@/components/SettingsButton.vue'
import ToolSettings from '@/components/ToolSettings.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import Divider from '@/components/Divider.vue'
import ToolColor from '@/components/ToolColor.vue'
import ColorPicker from '@/components/ColorPicker.vue'
import Zoom from '@/components/Zoom.vue'

const documentStore = useDocumentStore()
const uiStore = useUIStore()
</script>

<style scoped>
.Settings {
  height: 100%;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--spaceS);
  padding: 0 var(--spaceM);
}

.group {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spaceM);
  align-items: center;
}

.group:first-child {
  justify-content: start;
}

.group:last-child {
  justify-content: end;
}
</style>
