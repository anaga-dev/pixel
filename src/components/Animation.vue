<template>
  <section class="Animation">
    <div class="playback">
      <Button label="Skip to first frame" variant="ghost" :disabled="!pixelDocument.canGoToFirstFrame" @click="pixelDocument.goToFirstFrame()">
        <Icon i="skip-first" />
      </Button>
      <Button label="Skip to previous frame" variant="ghost" :disabled="!pixelDocument.canGoToPreviousFrame" @click="pixelDocument.goToPreviousFrame()">
        <Icon i="skip-previous" />
      </Button>
      <Button :label="pixelDocument.isPlaying ? 'Pause' : 'Play'" variant="ghost" :disabled="!pixelDocument.canPlayAnimation" @click="pixelDocument.toggleAnimation()">
        <Icon i="pause" v-if="pixelDocument.isPlaying" />
        <Icon i="play" v-else />
      </Button>
      <Button label="Skip to next frame" variant="ghost" :disabled="!pixelDocument.canGoToNextFrame" @click="pixelDocument.goToNextFrame()">
        <Icon i="skip-next" />
      </Button>
      <Button label="Skip to last frame" variant="ghost" :disabled="!pixelDocument.canGoToLastFrame" @click="pixelDocument.goToLastFrame()">
        <Icon i="skip-last" />
      </Button>
    </div>
    <div class="actions">
      <Button label="Duplicate active frame" variant="ghost" @click="pixelDocument.duplicateFrame()">
        <Icon i="duplicate-frame" />
      </Button>
      <Button label="Add new empty frame" variant="ghost" @click="pixelDocument.addFrame()">
        <Icon i="add-item" />
      </Button>
    </div>
    <div class="frames">
      <AnimationFrame
        v-for="(frame, index) in pixelDocument.frames"
        :key="index"
        :frame="frame"
        :active="index === pixelDocument.animation.current"
        @click="pixelDocument.setCurrentFrame(index)"></AnimationFrame>
    </div>
  </section>
</template>

<script setup>
import { useDocumentStore } from '@/stores/PixelDocument'
import AnimationFrame from '@/components/AnimationFrame.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

const pixelDocument = useDocumentStore()


</script>

<style scoped>
.Animation {
  display: grid;
  padding-bottom: var(--spaceM);
  grid-template-areas:
    "playback actions"
    "frames frames";
    justify-content: space-between;
    align-items: center;
}

.playback, .actions {
  padding: var(--spaceS) var(--spaceM);
  display: grid;
  grid-auto-flow: column;
  gap: var(--spaceS);
}

.playback {
  grid-area: playback;
  justify-self: start;
}

.actions {
  justify-self: end;
  grid-area: actions;
}

.frames {
  grid-area: frames;
  justify-self: center;
  display: grid;
  grid-auto-flow: column;
  gap: var(--spaceM);
  max-width: 100vw;
  overflow-y: hidden;
  overflow-x: auto;
}

</style>
