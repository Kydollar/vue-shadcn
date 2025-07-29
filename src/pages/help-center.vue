<script setup lang="ts">
import Page from '@/components/global-layout/basic-page.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ISocialMediaAccount {
  title: string
  desc: string
  url: string
}

const socialMediaAccounts = ref<ISocialMediaAccount[]>([
  { title: 'GitHub', desc: ' The source code of Shadcn UI is publicly available on GitHub.', url: '#' },
])
</script>

<template>
  <Page
    title="Help Center"
    description="Help Center description"
  >
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can find answers to your questions in our help center.
      </AlertDescription>
    </Alert>

    <ul class="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="account in socialMediaAccounts" :key="account.title">
        <a :href="account.url || '#'" target="_blank" rel="noopener noreferrer" class="block p-4 border rounded-lg shadow-sm bg-background border-border">
          <h2 class="mb-2 text-lg font-bold">
            {{ account.title }}
          </h2>
          <p class="text-sm text-stone-500">
            {{ account.desc }}
          </p>
        </a>
      </li>
    </ul>
  </Page>
</template>

<style scoped>
</style>
