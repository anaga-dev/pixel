<script setup>
import { storeToRefs } from 'pinia'
import { useTransformStore } from '@/stores/transform'
import { useDocumentStore } from '@/stores/document'

const transformStore = useTransformStore()
const documentStore = useDocumentStore()

const box = ref(null)
const { boundaries } = storeToRefs(transformStore)
const { getLayerBoundaries } = transformStore

/**
 * Updates the size and position of the canvas.
 */
const updateSizeAndPosition = () => {
  boundaries.value = getLayerBoundaries()
  const { width, height, x, y } = transformStore.boundaries
  box.value.style.width = `${documentStore.zoom.current.value * width}px`
  box.value.style.height = `${documentStore.zoom.current.value * height}px`

  box.value.style.left = `${
    documentStore.canvasRect.x + x * documentStore.zoom.current.value
  }px`
  box.value.style.top = `${
    documentStore.canvasRect.y + y * documentStore.zoom.current.value
  }px`
}

const pipeline = [updateSizeAndPosition]

useRequestAnimationFrame(pipeline)

onMounted(() => {
  console.log(boundaries.value)
})
</script>

<template>
  <div
    ref="box"
    class="BoundingBox"
  >
    <div class="corner left top" />
    <div class="corner right top" />
    <div class="corner right bottom" />
    <div class="corner left bottom" />
  </div>
</template>

<style scoped>
.BoundingBox {
  position: absolute;
  border: 2px solid var(--colorAccent);
  pointer-events: none;
}

.corner {
  position: absolute;
  width: var(--spaceM);
  aspect-ratio: 1;
  background-color: var(--colorLayer0);
  border: 2px solid var(--colorAccent);
}

.corner.left {
  left: 0;
}
.corner.right {
  right: 0;
}
.corner.top {
  top: 0;
}
.corner.bottom {
  bottom: 0;
}

.corner.left.top {
  translate: -50% -50%;
}

.corner.right.top {
  translate: 50% -50%;
}

.corner.right.bottom {
  translate: 50% 50%;
}
.corner.left.bottom {
  translate: -50% 50%;
}
</style>
