import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// Daftar tema dan warna utama
export const THEMES = ['zinc', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet', 'doom64'] as const
export type Theme = typeof THEMES[number]

export const themes: { theme: Theme, primaryColor: string }[] = [
  { theme: 'zinc', primaryColor: 'oklch(44.2% 0.017 285.786)' },
  { theme: 'red', primaryColor: 'oklch(57.7% 0.245 27.325)' },
  { theme: 'rose', primaryColor: 'oklch(0.645 0.246 16.439)' },
  { theme: 'orange', primaryColor: 'oklch(0.705 0.213 47.604)' },
  { theme: 'green', primaryColor: 'oklch(0.723 0.219 149.579)' },
  { theme: 'blue', primaryColor: 'oklch(48.8% 0.243 264.376)' },
  { theme: 'yellow', primaryColor: 'oklch(68.1% 0.162 75.834)' },
  { theme: 'violet', primaryColor: 'oklch(0.606 0.25 292.717)' },
  { theme: 'doom64', primaryColor: 'oklch(0.5016 0.1887 27.4816)' },
]

export const RADIUS = [0, 0.25, 0.5, 0.75, 1] as const
export type Radius = typeof RADIUS[number]

function applyTheme(theme: string) {
  document.documentElement.classList.remove(...THEMES.map(t => `theme-${t}`))
  document.documentElement.classList.add(`theme-${theme}`)
}

function applyRadius(radius: number) {
  document.documentElement.style.setProperty('--radius', `${radius}rem`)
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('zinc')
  const radius = ref<Radius>(0.5)

  function setTheme(value: typeof theme.value) {
    theme.value = value
    localStorage.setItem('theme', value)
  }

  function setRadius(value: Radius) {
    radius.value = value
    localStorage.setItem('radius', String(value))
  }

  // Apply saat nilai berubah
  watch(theme, val => applyTheme(val), { immediate: true })
  watch(radius, val => applyRadius(val), { immediate: true })

  // Restore dari localStorage saat inisialisasi
  if (typeof localStorage !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as Theme
    const savedRadius = localStorage.getItem('radius') as Radius | null

    if (savedTheme)
      theme.value = savedTheme
    if (savedRadius)
      radius.value = savedRadius
  }

  return {
    theme,
    setTheme,
    radius,
    setRadius,
  }
}, {
  persist: true,
})
