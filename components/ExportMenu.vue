<script setup>
import { useDocumentStore } from '@/stores/document'
const documentStore = useDocumentStore()

const formats = [
  {
    label: 'PNG',
    value: 'png'
  },
  {
    label: 'JPEG',
    value: 'jpeg'
  },
  {
    label: 'WebP',
    value: 'webp'
  }
]

const scales = [
  {
    label: 'x1',
    value: 1
  },
  {
    label: 'x2',
    value: 2
  },
  {
    label: 'x4',
    value: 4
  },
  {
    label: 'x8',
    value: 8
  },
  {
    label: 'x16',
    value: 16
  }
]

const format = ref('png')
const scale = ref(1)
const quality = ref(90)

function handleExport() {
  console.log('exporting')
  documentStore.exportFileAs(format.value, scale.value, quality.value)
}
</script>

<template>
  <Modal :title="$t('export-artwork')">
    <div class="ExportMenu">
      <div class="row">
        <label>{{ $t('format') }}</label>
        <ButtonSelect :data="formats" v-model="format" />
      </div>
      <div class="row">
        <label>Scale</label>
        <ButtonSelect :data="scales" v-model="scale" />
      </div>
      <div class="row">
        <label for="">Quality</label>
        <Slider v-model="quality" />
      </div>
      <Button variant="primary" @click="handleExport">{{
        $t('export-file')
      }}</Button>
    </div>
  </Modal>
</template>

<style scoped>
.ExportMenu {
  display: grid;
  gap: var(--spaceL);
}

.row {
  display: grid;
  gap: var(--spaceS);
}
</style>
