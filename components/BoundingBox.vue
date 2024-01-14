<script setup>
import { storeToRefs } from 'pinia'
import { useTransformStore } from '@/stores/transform'
import { useDocumentStore } from '@/stores/document'
import { useZoomStore } from '@/stores/zoom'
const transformStore = useTransformStore()
const documentStore = useDocumentStore()
const zoomStore = useZoomStore()

const box = ref(null)
const { boundaries } = storeToRefs(transformStore)
const { getLayerBoundaries } = transformStore

/**
 * Updates the size and position of the canvas.
 */
const updateSizeAndPosition = () => {
  boundaries.value = getLayerBoundaries()
  const { width, height, x, y } = transformStore.boundaries
  box.value.style.width = `${zoomStore.current * width}px`
  box.value.style.height = `${zoomStore.current * height}px`

  box.value.style.left = `${
    documentStore.canvasRect.x + x * zoomStore.current
  }px`
  box.value.style.top = `${
    documentStore.canvasRect.y + y * zoomStore.current
  }px`
}

const pipeline = [updateSizeAndPosition]

useRequestAnimationFrame(pipeline)

onMounted(() => {
  console.log(boundaries.value)
})
</script>

<template>
  <div class="BoundingBox" ref="box">
    <div class="corner left top"></div>
    <div class="corner right top"></div>
    <div class="corner right bottom"></div>
    <div class="corner left bottom"></div>
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
