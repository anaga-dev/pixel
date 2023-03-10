<template>
  <div class="animation">
    <div class="controls">
      <div class="left">
        <button type="button" @click="document.addFrame()">
          <i class="bx bx-duplicate"></i>
        </button>
        <button type="button" @click="document.duplicateFrame()">
          <i class="bx bx-duplicate"></i>
        </button>
      </div>
      <div class="center">
        <button type="button" :disabled="!document.canGoToFirstFrame" @click="document.goToFirstFrame()">
          <i class="bx bx-skip-previous"></i>
        </button>
        <button type="button" :disabled="!document.canGoToPreviousFrame" @click="document.goToPreviousFrame()">
          <i class="bx bx-skip-previous"></i>
        </button>
        <button type="button" :disabled="!document.canPlayAnimation" @click="document.toggleAnimation()">
          <i v-if="document.isPlaying" class="bx bx-pause"></i>
          <i v-else class="bx bx-play"></i>
        </button>
        <button type="button" :disabled="!document.canGoToNextFrame" @click="document.goToNextFrame()">
          <i class="bx bx-skip-next"></i>
        </button>
        <button type="button" :disabled="!document.canGoToLastFrame" @click="document.goToLastFrame()">
          <i class="bx bx-skip-next"></i>
        </button>
      </div>
      <div class="right">
        <button type="button" @click="document.addFrame()">
          <i class="bx bx-duplicate"></i>
        </button>
        <button type="button" @click="document.duplicateFrame()">
          <i class="bx bx-duplicate"></i>
        </button>
      </div>
    </div>
    <div class="frames">
      <AnimationFrame
        v-for="(frame, index) in document.frames"
        :key="index"
        :frame="frame"
        :active="index === document.animation.current"
        @click="document.setCurrentFrame(index)"></AnimationFrame>
    </div>
  </div>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'
import AnimationFrame from './AnimationFrame.vue'

const document = useDocumentStore()
</script>

<style scoped>
.animation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 auto;
  box-sizing: border-box;
  padding: .5rem;
  width: 100%; /* No entiendo por qué esto no funciona sin el width: 100% */
}

.left, .center, .right {
  display: flex;
  gap: 0.25rem;
}

.frames {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  max-width: 100vw;
  overflow-y: hidden;
  overflow-x: auto;
}

</style>
