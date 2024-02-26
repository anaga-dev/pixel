export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', {
    mounted(el) {
      el.focus()
    },
    // you can provide SSR-specific logic here
    // getSSRProps(binding, vnode)
    getSSRProps() {
      return {}
    }
  })
})
