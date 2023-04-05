<template>
  <Button label="Settings menu" :active="ui.isShowingGeneralSettings" variant="ghost" @click="ui.toggleGeneralSettings">
    <Icon i="menu" />
  </Button>
  <Dropdown v-if="ui.isShowingGeneralSettings" class="menu" @close="ui.toggleGeneralSettings">
    <Button label="New file">New file</Button>
    <Button label="Open file">Open file</Button>
    <Button label="Save file">Save file</Button>
  </Dropdown>
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
import Icon from '@components/Icon.vue'
import Button from '@components/Button.vue'
import Dropdown from '@components/Dropdown.vue'

const ui = useUIStore()

</script>

<style scoped>
.menu {
  top: calc(var(--widthToolbar) + var(--spaceS));
  left: var(--spaceS);
}
</style>