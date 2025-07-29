import type { BasicColorSchema } from '@vueuse/core'
import type { Component } from 'vue'

import { Moon, Sun, SunMoon } from 'lucide-vue-next'

export interface ColorModeOption {
  label: string
  value: BasicColorSchema
  icon: Component
}

export const colorModeOptions: ColorModeOption[] = [
  { label: 'Light', value: 'light', icon: Sun },
  { label: 'Dark', value: 'dark', icon: Moon },
  { label: 'System', value: 'auto', icon: SunMoon },
]
