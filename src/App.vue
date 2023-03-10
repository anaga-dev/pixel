<template>
  <main class="main">
    <div class="menu">
      <router-link to="/">
        <i class="bx bx-home"></i>
      </router-link>
      <router-link to="/pixel">
        <i class="bx bx-palette"></i>
      </router-link>
    </div>
    <router-view></router-view>
  </main>
</template>

<style scoped>
.main {
  display: flex;
  width: 100%;
  height: 100%;
}
.menu {
  width: 2rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #1b1b1f;
}
</style>
