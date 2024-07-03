<script setup>
const error = useError()

const description = computed(() => {
  switch (error.statusCode) {
    case 404:
      return 'error.description-404'
    case 500:
      return 'error.description-500'
    default:
      return 'error.description-default'
  }
})
</script>

<template>
  <div class="PAGE">
    <div class="Error">
      <h1>
        {{ $t('error.title') }} <span class="code">{{ error.statusCode }}</span>
      </h1>
      <p>{{ $t(description) }}</p>
      <p>
        <NuxtLink :to="localePath('/')">
          {{ $t('error.link') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.PAGE {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.Error {
  width: 40%;
  display: grid;
  gap: var(--space-m);
}

h1 {
  font-family: 'Silkscreen';
  font-size: 6vw;
  color: var(--color-base-50);
}

p {
  font-size: var(--font-size-l);
}

.code {
  color: var(--color-critical);
}

a:is(:link, :visited) {
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 4px;
}

a:is(:link, :visited):hover {
  color: var(--color-brand);
}
</style>
