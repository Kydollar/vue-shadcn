import { THEMES, useThemeStore } from '@/stores/theme'

// Daftar semua tema

export function setupTheme() {
  const themeStore = useThemeStore()

  const theme = themeStore.theme
  const radius = themeStore.radius

  // Set theme class di html
  document.documentElement.classList.remove(...THEMES.map(t => `theme-${t}`))
  document.documentElement.classList.add(`theme-${theme}`)

  // Set custom radius variable
  document.documentElement.style.setProperty('--radius', `${radius}rem`)
}
