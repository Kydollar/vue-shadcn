<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watchEffect } from 'vue'

import Loading from '@/components/loading.vue'
import { Toaster } from '@/components/ui/sonner'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { theme, radius } = storeToRefs(themeStore)

// Helper: update theme class
function updateThemeClass(themeValue: string) {
  const themeList = ['zinc', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet', 'doom64']
  document.documentElement.classList.remove(...themeList.map(t => `theme-${t}`))
  document.documentElement.classList.add(`theme-${themeValue}`)
}

// Helper: update radius variable
function updateRadiusVar(radiusValue: number) {
  document.documentElement.style.setProperty('--radius', `${radiusValue}rem`)
}

// Watchers
watchEffect(() => updateThemeClass(theme.value))
watchEffect(() => updateRadiusVar(radius.value))
</script>

<template>
  <Toaster />
  <!-- <VueQueryDevtools /> -->

  <Suspense>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route" />
    </router-view>

    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>
