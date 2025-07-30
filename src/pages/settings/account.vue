<script setup lang="ts">
import AccountForm from './components/account-form.vue'
import SettingsLayout from './components/settings-layout.vue'
</script>

<template>
  <SettingsLayout>
    <AccountForm />
  </SettingsLayout>
</template>

<style scoped>
</style>

<route lang="yaml">
  meta:
    auth: true
</route>
