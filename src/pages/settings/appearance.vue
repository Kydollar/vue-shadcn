<script setup lang="ts">
import AppearanceForm from './components/appearance-form.vue'
import SettingsLayout from './components/settings-layout.vue'
</script>

<template>
  <SettingsLayout>
    <AppearanceForm />
  </SettingsLayout>
</template>

<style scoped>
</style>

<route lang="yaml">
  meta:
    auth: true
</route>
