<template>
  <Button label="Settings menu" variant="ghost" @click.stop="uiStore.toggleOverlay(overlay)">
    <Icon i="menu" />
  </Button>
  <Dropdown v-if="uiStore.showOverlay === overlay" class="menu" @close="uiStore.toggleOverlay(overlay)">
    <Button label="New file">New file</Button>
    <Button label="Open file">Open file</Button>
    <Button label="Save file" @click="documentStore.exportAs">Save file</Button>
  </Dropdown>
</template>

<script setup>
import { useUIStore } from '@/stores/UIStore'
import { useDocumentStore } from '@/stores/DocumentStore'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import Dropdown from '@/components/Dropdown.vue'

const overlay = 'general-settings'

const uiStore = useUIStore()
const documentStore = useDocumentStore()

</script>

<style scoped>
.menu {
  left: calc(var(--widthToolbar) + var(--spaceS));
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
