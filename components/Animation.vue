<template>
  <section class="Animation">
    <div class="playback">
      <Button label="Skip to first frame" variant="ghost" :disabled="!documentStore.canGoToFirstFrame" @click="documentStore.goToFirstFrame()">
        <Icon i="skip-first" />
      </Button>
      <Button label="Skip to previous frame" variant="ghost" :disabled="!documentStore.canGoToPreviousFrame" @click="documentStore.goToPreviousFrame()">
        <Icon i="skip-previous" />
      </Button>
      <Button :label="documentStore.isPlaying ? 'Pause' : 'Play'" variant="ghost" :disabled="!documentStore.canPlayAnimation" @click="documentStore.toggleAnimation()">
        <Icon i="pause" v-if="documentStore.isPlaying" />
        <Icon i="play" v-else />
      </Button>
      <Button label="Skip to next frame" variant="ghost" :disabled="!documentStore.canGoToNextFrame" @click="documentStore.goToNextFrame()">
        <Icon i="skip-next" />
      </Button>
      <Button label="Skip to last frame" variant="ghost" :disabled="!documentStore.canGoToLastFrame" @click="documentStore.goToLastFrame()">
        <Icon i="skip-last" />
      </Button>
    </div>
    <div class="actions">
      <Button label="Duplicate active frame" variant="ghost" @click="documentStore.duplicateFrame()">
        <Icon i="duplicate-frame" />
      </Button>
      <Button label="Add new empty frame" variant="ghost" @click="documentStore.addFrame()">
        <Icon i="add-item" />
      </Button>
    </div>
    <div class="frames">
      <AnimationFrame
        v-for="(frame, index) in documentStore.frames"
        :key="index"
        :frame="frame"
        :active="index === documentStore.animation.current"
        @click="documentStore.setCurrentFrame(index)"></AnimationFrame>
    </div>
  </section>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()


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
