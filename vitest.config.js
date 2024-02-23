import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  // any custom Vitest config you require
  test: {
    environment: 'nuxt',
    coverage: {
      enabled: true,
      reporter: ['text', 'html']
    }
  }
})
