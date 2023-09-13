<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <Dialog v-if="show" />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/ui'
import { useConfirmationStore } from '@/stores/confirmation'
const uiStore = useUIStore()
const confirmationStore = useConfirmationStore()

const { show } = storeToRefs(confirmationStore)
</script>
