<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Dialog v-if="showDialog" />
  <Tooltip v-if="tooltip" />
  <Notifications />
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
import { useConfirmationStore } from '@/stores/confirmation'

const uiStore = useUIStore()
const confirmationStore = useConfirmationStore()

const { showDialog } = storeToRefs(confirmationStore)
const { tooltip } = storeToRefs(uiStore)
</script>
