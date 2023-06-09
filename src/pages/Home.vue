<template>
  <div class="PAGE">
    <Background class="background" />
    <main>
      <div class="hero">
        <h1>Create pixel art on any device</h1>
        <p>Pixel is a progressive web application that lets you create pixel art on any device, operating system, and browser. Unleash your creativity without boundaries.</p>
        <div class="links">
          <RouterLink class="button-app" to="/studio">Start for free!</RouterLink>
          <a class="button-repo" href="">Github</a>
        </div>
      </div>
       <img src="@/assets/pixel.png">
    </main>
    <footer></footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Background from '@/components/Background.vue'

const router = useRouter()

/*
import { useTouch } from '../composables/useTouch'

const touch = useTouch(document.body)
console.log(touch)

watch(touch.distance, (value) => console.log('distance', value))
watch(touch.angle, (value) => console.log('angle', value))
*/
</script>

<style scoped>
.PAGE {
  display: grid;
  place-content: center;
  min-height: 100svh;
  position: relative;
  background-color: var(--colorBgHome);
  overflow: hidden;
}

.background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: auto;
  z-index: 0;
  fill: var(--colorBgHomeAlt);
}

h1 {
  font-family: 'Merriweather';
  font-size: var(--fontSizeXL);
  color: var(--colorTextPrimary);
  line-height: 1.25;
  margin: 0;
  font-weight: normal;
  max-inline-size: 20ch;
  text-wrap: balance;
}

p {
  font-size: var(--fontSizeL);
  max-inline-size: 60ch;
  line-height: 1.33;
}

main {
  text-align: center;
  max-width: 1200px;
  margin: auto;
  padding: var(--spaceXXL) var(--spaceXL);
  z-index: 1;
}

.hero {
  display: grid;
  gap: var(--spaceL);
  place-content: center;
  justify-items: center;
  min-height: 60vh;
}

img {
  background-color: black;
  width: 100%;
  max-width: 1200px;
  height: auto;
  box-shadow: var(--shadowLayer);
}

.links {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spaceM);
  place-content: center;
}

.button-app {
  justify-self: auto;
  background-color: var(--colorAccent);
  color: var(--colorLayer1);
  text-decoration: none;
  min-width: 16rem;
  font-weight: bold;
  font-size: var(--fontSizeL);
  padding: var(--spaceL) var(--spaceXL);
}

.button-repo {
  justify-self: auto;
  background-color: transparent;
  border: 2px solid currentColor;
  color: var(--colorAccent);
  text-decoration: none;
  font-weight: bold;
  font-size: var(--fontSizeL);
  padding: var(--spaceL) var(--spaceXL);
}
</style>