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

const title = ref('Untitled')
const format = ref('png')
const scale = ref(1)
const quality = ref(90)

function handleExport() {
  console.log('exporting')
  documentStore.exportFileAs(
    title.value,
    format.value,
    scale.value,
    quality.value
  )
}
</script>

<template>
  <Modal :title="$t('export-artwork')">
    <div class="ExportMenu">
      <Field :label="$t('title')">
        <input type="text" v-model="title" />
      </Field>
      <Field :label="$t('format')">
        <ButtonSelect :data="formats" v-model="format" />
      </Field>
      <Field :label="$t('scale')">
        <ButtonSelect :data="scales" v-model="scale" />
      </Field>
      <Field :label="$t('quality')">
        <Slider v-model="quality" />
      </Field>
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
