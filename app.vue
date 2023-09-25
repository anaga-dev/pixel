<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <Dialog v-if="showDialog" />
  <Tooltip v-if="showTooltip" />
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
import { useConfirmationStore } from '@/stores/confirmation'
const uiStore = useUIStore()
const confirmationStore = useConfirmationStore()

const { showDialog } = storeToRefs(confirmationStore)
const { showTooltip } = storeToRefs(uiStore)
</script>
