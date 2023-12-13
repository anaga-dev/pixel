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
      <article>
        <section class="hero">
          <h1>{{ $t('website.hero-title') }}</h1>
          <p>{{ $t('website.hero-description') }}</p>
          <div class="links">
            <NuxtLink class="button-app" to="/studio">{{
              $t('website.start-now')
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
        </section>
        <img src="@/assets/pixel_screenshot.png" />
        <section class="features"></section>
      </article>
    </main>
    <footer>
      <p>
        {{ $t('website.made-by') }}
        <a href="https://anaga.dev" title="Go to Anaga website" target="_blank"
          >Anaga</a
        >
        {{ $t('website.in-madrid') }} -- 2023
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
  --colorBgHome: hsl(94 66% 52%);
  --colorBgHomeAlt: hsl(94 66% 18%);

  min-height: 100svh;
  position: relative;
  overflow: hidden;
  padding: 0 var(--spaceL);
  color: var(--colorLayer0);
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
  color: var(--colorTextPrimary);
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
  font-size: clamp(1.5rem, 8vw, 6rem);
  /* color: var(--colorTextPrimary); */
  line-height: 1;
  margin: 0 auto;
  font-weight: normal;
  text-wrap: balance;
  text-shadow: calc(var(--spaceS) * -1) var(--spaceS) 0 var(--colorShadow);
}

.hero p {
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  max-inline-size: 60ch;
  line-height: 1.5;
  margin: auto;
}

main {
  text-align: center;
  padding: var(--spaceXXL) var(--spaceXL);
  background-color: var(--colorBgHome);
  z-index: 1;
}

article {
  max-width: 1200px;
  margin: auto;
}

.hero {
  display: grid;
  gap: var(--spaceXL);
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
  color: var(--colorTextPrimary);
  padding: var(--spaceXXL) var(--spaceXL);
  margin: 0 auto;
  text-align: center;
}

a:is(:link, :visited):not([class]) {
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 4px;
  color: var(--colorAccent);
}
</style>
