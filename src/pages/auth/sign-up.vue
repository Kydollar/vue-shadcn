<script setup lang="ts">
import AuthTitle from './components/auth-title.vue'
import SignUpForm from './components/sign-up-form.vue'
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-4 min-w-screen">
    <main class="flex flex-col gap-4">
      <AuthTitle />
      <SignUpForm />
    </main>
  </div>
</template>
