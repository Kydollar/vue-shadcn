<script lang="ts" setup>
import { useColorMode } from '@vueuse/core'

import { colorModeOptions } from '@/constants/color-mode-options'

const mode = useColorMode({
  emitAuto: true,
})

function setColorMode(value: typeof mode.value) {
  mode.value = value
}
</script>

<template>
  <div class="space-y-1.5 pt-6">
    <UiLabel class="text-xs">
      Color Mode
    </UiLabel>

    <div class="grid grid-cols-3 gap-2 py-1.5">
      <UiButton
        v-for="option in colorModeOptions"
        :key="option.value"
        variant="outline"
        class="h-8 px-3 flex items-center justify-center gap-1.5 text-xs"
        :class="option.value === mode ? 'border-foreground border-2 !bg-foreground/15 !text-foreground' : ''"
        @click="setColorMode(option.value)"
      >
        <component :is="option.icon" class="w-4 h-4" />
        {{ option.label }}
      </UiButton>
    </div>
  </div>
</template>

<style scoped>
/* Pastikan bahwa kelas-kelas yang digunakan dalam template didefinisikan dengan benar */
</style>
