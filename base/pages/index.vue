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

<template>
  <div class="PAGE">
    <header>
      <Logo class="Logo" />
      <div class="actions">
        <button
          v-if="installable"
          class="button-install"
          @click="handleInstallClick"
        >
          {{ $t('install') }}
        </button>
      </div>
    </header>
    <main>
      <section id="hero">
        <div class="content-wrapper">
          <h1>
            <div v-for="line in $tm('homepage.hero.title')">
              {{ $rt(line) }}
            </div>
          </h1>
          <p>{{ $t('homepage.hero.description') }}</p>
          <div class="links">
            <NuxtLink class="button-app" to="/studio">{{
              $t('homepage.start-now')
            }}</NuxtLink>
            <a
              class="button-repo"
              href="https://github.com/anaga-dev/pixel"
              title="Go to Pixel's Github page"
              target="_blank"
            >
              Github
            </a>
          </div>
          <img src="@/assets/pixel_screenshot.png" />
        </div>
      </section>
    </main>
    <footer>
      <div class="content-wrapper">
        <p>
          {{ $t('homepage.made-by') }}
          <a
            href="https://anaga.dev"
            title="Go to Anaga website"
            target="_blank"
            >Anaga</a
          >
          {{ $t('homepage.in-madrid') }} -- 2024
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.PAGE {
  --headerHeight: 6rem;
  --colorBgHome: hsl(94 66% 52%);
  --colorBgHomeAlt: hsl(94 66% 18%);
  --spaceL: 2.5rem;
  --spaceXL: 4rem;
  --spaceXXL: 6rem;

  min-height: 100svh;
  position: relative;
  overflow: hidden;
  color: var(--colorLayer0);
  user-select: auto;
}

header {
  background-color: var(--colorBgHome);
  color: var(--colorTextPrimary);
  padding: 0 var(--spaceL);
  height: var(--headerHeight);
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: space-between;
  align-items: center;
}

.Logo {
  fill: var(--colorLayer0);
  width: 3rem;
}

.actions {
  display: grid;
  justify-content: end;
}

h1 {
  font-family: 'Silkscreen';
  font-size: clamp(2rem, 6vw, 4rem);
  color: var(--colorLayer0);
  line-height: 1.1;
  margin: 0;
  max-inline-size: 20ch;
}

h1 div {
  white-space: nowrap;
  font-weight: normal;
}

#hero {
  background-color: var(--colorBgHome);
  padding: var(--spaceXL) var(--spaceL) 0;
}

.content-wrapper {
  display: grid;
  justify-items: center;
  gap: var(--spaceL);
  max-width: 1280px;
  margin: auto;
}

p {
  font-size: var(--fontSizeL);
  font-weight: normal;
  max-inline-size: 60ch;
}

main {
  text-align: center;
  z-index: 1;
}

section {
  display: grid;
  justify-items: center;
  gap: var(--spaceL);
}

#hero img {
  background-color: black;
  width: 100%;
  max-width: 1200px;
  height: auto;
  box-shadow: var(--shadowLayer);
  margin: 0 auto;
  translate: 0 var(--spaceXL);
}

.links {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spaceM);
  place-content: center;
}

.button-install {
  color: var(--colorAccent);
  border: 4px solid currentColor;
  height: 3rem;
}

.links > * {
  display: grid;
  place-content: center;
  background-color: var(--colorLayer0);
  color: var(--colorTextPrimary);
  font-size: var(--fontSizeL);
  padding: 0 var(--spaceL);
  text-decoration: none;
  cursor: pointer;
  height: 5rem;
}

.button-app {
  background-color: var(--colorLayer0);
  color: var(--colorTextPrimary);
}

.button-repo {
  background-color: transparent;
  border: 4px solid currentColor;
  color: var(--colorLayer0);
}

footer {
  color: var(--colorTextPrimary);
  padding: calc(var(--spaceXXL) * 2) var(--spaceXL) var(--spaceXL);
  margin: 0 auto;
  text-align: center;
}

a:is(:link, :visited):not([class]) {
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 4px;
  color: var(--colorAccent);
}

@media (min-width: 1024px) {
  .links > * {
    min-width: 16rem;
  }
}

</style>
