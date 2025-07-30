<script setup lang="ts">
import NotificationsForm from './components/notifications-form.vue'
import SettingsLayout from './components/settings-layout.vue'
</script>

<template>
  <SettingsLayout>
    <NotificationsForm />
  </SettingsLayout>
</template>

<style scoped>
</style>

<route lang="yaml">
  meta:
    auth: true
</route>
