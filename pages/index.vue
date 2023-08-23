<template>
  <div class="PAGE">
    <Background class="background" />
    <header>
      <Logo class="Logo" />
      <div class="actions">
        <button
          v-if="installable"
          class="button-install"
          @click="handleInstallClick"
        >
          Install Pixel
        </button>
      </div>
    </header>
    <main>
      <section class="hero">
        <h1>Create pixel art on any device</h1>
        <p>
          Pixel is a progressive web application that lets you create pixel art
          on any device, operating system, and browser. Unleash your creativity
          without boundaries.
        </p>
        <div class="links">
          <NuxtLink class="button-app" to="/studio">Use it now!</NuxtLink>
          <a
            class="button-repo"
            href="https://github.com/anaga-dev/pixel"
            title="Go to Pixel's Github page"
            target="_blank"
          >
            Github
          </a>
        </div>
      </section>
      <img src="@/assets/pixel_screenshot.png" />
      <section class="features"></section>
    </main>
    <footer>
      <p>
        Made by
        <a href="https://anaga.dev" title="Go to Anaga website" target="_blank"
          >Anaga</a
        >
        with ♥ in Madrid -- 2023
      </p>
    </footer>
  </div>
</template>

<script setup>
const router = useRouter()

// This Promise is resolved when user clicks on install button.
let installPrompt = null
const installable = ref(false)

/**
 * Handle install button click.
 */
async function handleInstallClick() {
  if (!installPrompt) return

  const result = await installPrompt.prompt()
  if (result.outcome === 'accepted') {
    router.replace('/studio')
  }

  installable.value = false
  installPrompt = null
}

onMounted(() => {
  // We make sure that we're not in standalone mode. If we are, we redirect to studio.
  if (window.matchMedia('(display-mode: standalone)').matches) {
    installable.value = false
    installPrompt = null
    router.replace('/studio')
  }

  // We listen to the event beforeinstallprompt if the browser supports it
  // in order to display the install button.
  window.addEventListener(
    'beforeinstallprompt',
    (event) => {
      event.preventDefault()
      installPrompt = event
      installable.value = true
    },
    { once: true }
  )
})
</script>

<style scoped>
.PAGE {
  --headerHeight: 6rem;
  --colorBgHome: hsl(162 60% 48%);
  --colorBgHomeAlt: hsl(162 66% 18%);

  display: grid;
  min-height: 100svh;
  margin: 0 var(--spaceL) var(--spaceL);
  position: relative;
  background-color: var(--colorBgHome);
  overflow: hidden;
  color: var(--colorTextPrimary);
  user-select: auto;
}

.background {
  position: absolute;
  left: 0;
  top: var(--headerHeight);
  width: 100%;
  height: auto;
  z-index: 0;
  fill: var(--colorBgHomeAlt);
  opacity: 0.3;
}

header {
  background-color: var(--colorLayer0);
  height: var(--headerHeight);
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: space-between;
  align-items: center;
}

.Logo {
  width: 3rem;
}

.actions {
  display: grid;
  justify-content: end;
}

h1 {
  font-family: 'Silkscreen';
  font-size: clamp(1.5rem, 10vw, 6rem);
  color: var(--colorTextPrimary);
  line-height: 1.25;
  margin: 0;
  font-weight: normal;
  max-inline-size: 20ch;
  text-wrap: balance;
  text-shadow: calc(var(--spaceS) * -1) var(--spaceS) 0 var(--colorShadow);
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
  margin-bottom: var(--spaceXL);
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

[class^='button'] {
  display: grid;
  place-content: center;
  font-family: 'Silkscreen';
  font-size: var(--fontSizeL);
  padding: 0 var(--spaceM);
  text-decoration: none;
  cursor: pointer;
}

.button-install {
  color: var(--colorAccent);
  border: 4px solid currentColor;
  height: 3rem;
}

.button-app {
  justify-self: auto;
  background-color: var(--colorLayer0);
  color: var(--colorTextPrimary);
  min-width: 16rem;
  height: 5rem;
}

.button-repo {
  justify-self: auto;
  background-color: transparent;
  border: 4px solid currentColor;
  color: var(--colorLayer0);
  height: 5rem;
}

footer {
  padding: var(--spaceXXL) var(--spaceXL);
  margin: auto;
}

a:is(:link, :visited):not([class]) {
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 4px;
  color: var(--colorLayer0);
}
</style>
