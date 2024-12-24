<template>
  <router-view />
  <SpeedInsights />
</template>

<script>
import { SpeedInsights } from '@vercel/speed-insights/vue'

export default {
  name: 'App',
  components: {
    SpeedInsights
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgba(0, 0, 0, 0.85);
}
</style>
