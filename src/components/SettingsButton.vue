<template>
  <Button label="Settings menu" :active="ui.isShowingGeneralSettings" variant="ghost" @click.stop="ui.toggleGeneralSettings">
    <Icon i="menu" />
  </Button>
  <Dropdown v-if="ui.isShowingGeneralSettings" class="menu" @close="ui.toggleGeneralSettings">
    <Button label="New file" @click="pixelDocument.newFile">New file</Button>
    <Button label="Open file" @click="pixelDocument.loadFile">Open file</Button>
    <Button label="Save file" @click="pixelDocument.saveFileAs">Save file</Button>
  </Dropdown>
</template>

<script setup>
import { useUIStore } from '@/stores/UI'
import { useDocumentStore } from '@/stores/Document'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import Dropdown from '@/components/Dropdown.vue'

const ui = useUIStore()
const pixelDocument = useDocumentStore()

</script>

<style scoped>
.menu {
  top: calc(var(--widthToolbar) + var(--spaceS));
  left: var(--spaceS);
}
</style>
