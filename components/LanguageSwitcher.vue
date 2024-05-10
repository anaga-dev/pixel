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
  gap: var(--spaceS);
  height: 100%;
  place-content: center;
  align-items: center;
  padding: 0 var(--spaceM);
  color: var(--colorTextPrimary);
}

.button-locale:hover {
  color: var(--colorAccent);
}

.LanguageSwitcherMenu {
  position: absolute;
  right: 0;
  bottom: calc(100% + var(--spaceM));
  background-color: var(--colorLayer0);
  color: var(--colorText);
  box-shadow: var(--shadowLayer);
  padding: var(--spaceM);
}

.language {
  display: block;
  padding: var(--spaceM) var(--spaceL);
  transition: var(--transition);
}
.language:hover {
  color: var(--colorAccent);
}
</style>
