<script setup>
import { useConfirmationStore } from '@/stores/confirmation'
const confirmationStore = useConfirmationStore()

</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Dialog v-if="confirmationStore.isShowingDialog" />
  <Notifications />
</template>
