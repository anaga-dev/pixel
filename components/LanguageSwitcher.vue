<script setup>
const { locale, locales } = useI18n()

const isLanguageMenuOpen = ref(false)
const menu = ref(null)

function toggleLanguageMenu() {
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
}

onClickOutside(menu, (e) => {
  e.stopPropagation()
  isLanguageMenuOpen.value = false
})
</script>

<template>
  <div class="LanguageSwitcher">
    <button class="button-locale" type="button" @click="toggleLanguageMenu">
      {{ locales.find((l) => l.code === locale).name }}
      <IconDropdown />
    </button>
    <menu v-if="isLanguageMenuOpen" ref="menu" class="LanguageSwitcherMenu">
      <NuxtLink
        v-for="lang in locales"
        class="language"
        :to="switchLocalePath(lang.code)"
        @click="toggleLanguageMenu"
      >
        {{ lang.name }}
      </NuxtLink>
    </menu>
  </div>
</template>

<style scoped>
.LanguageSwitcher {
  position: relative;
}

.button-locale {
  display: flex;
  gap: var(--space-s);
  height: 100%;
  place-content: center;
  align-items: center;
  padding: 0 var(--space-m);
  color: var(--color-base-50);
}

.button-locale:hover {
  color: var(--color-brand);
}

.LanguageSwitcherMenu {
  position: absolute;
  right: 0;
  bottom: calc(100% + var(--space-m));
  background-color: var(--color-base-950);
  color: var(--color-base-100);
  box-shadow: var(--shadow-floating-element);
  padding: var(--space-m);
}

.language {
  display: block;
  padding: var(--space-m) var(--space-l);
  transition: var(--transition);
}
.language:hover {
  color: var(--color-brand);
}
</style>
