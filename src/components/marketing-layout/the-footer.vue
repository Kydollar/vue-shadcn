<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()

const links = [
  {
    name: 'github',
    icon: 'simple-icons:github',
    url: '#',
  },
]
</script>

<template>
  <footer class="min-h-18 flex items-center justify-between">
    <UiAvatar>
      <UiAvatarImage :src="`${mode === 'dark' ? '/logo.svg' : '/logo-black.svg'}`" alt="Logo" />
    </UiAvatar>

    <div>© 2025 K404</div>

    <div class="flex items-center gap-2">
      <UiButton
        v-for="link in links"
        :key="link.name"
        variant="outline"
        size="icon"
        as="a"
        :href="link.url"
        target="_blank"
      >
        <Icon :icon="link.icon" />
      </UiButton>
    </div>
  </footer>
</template>

<style scoped></style>
