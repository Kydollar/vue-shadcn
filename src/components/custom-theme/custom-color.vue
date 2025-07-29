<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { themes, useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { setTheme } = themeStore
const { theme } = storeToRefs(themeStore)
</script>

<template>
  <div class="space-y-1.5 pt-2">
    <label class="text-xs">Color Theme</label>
    <div class="grid grid-cols-5 gap-2 py-1.5">
      <button
        v-for="item in themes"
        :key="item.theme"
        class="rounded-full w-full h-8 border-2 relative"
        :class="[
          theme === item.theme ? 'border-foreground' : 'border-transparent',
        ]"
        :style="{ background: item.primaryColor }"
        aria-label="Pilih tema"
        @click="setTheme(item.theme)"
      >
        <Check
          v-if="theme === item.theme"
          class="absolute inset-0 m-auto text-white"
          :size="16"
        />
      </button>
    </div>
  </div>
</template>
