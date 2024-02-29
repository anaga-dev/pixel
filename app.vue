<script setup>
import { useConfirmationStore } from '@/stores/confirmation'
const confirmationStore = useConfirmationStore()

const { showDialog } = storeToRefs(confirmationStore)
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Dialog v-if="showDialog" />
  <Notifications />
</template>