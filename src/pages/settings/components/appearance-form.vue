<script setup lang="ts">
import CustomColor from '@/components/custom-theme/custom-color.vue'
import CustomRadius from '@/components/custom-theme/custom-radius.vue'
import ToggleColorMode from '@/components/custom-theme/toggle-color-mode.vue'
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Appearance
    </h3>
    <p class="text-sm text-muted-foreground">
      Customize the appearance of the app. Automatically switch between day and night themes.
    </p>
  </div>

  <Separator class="my-4" />

  <CustomColor />
  <CustomRadius />
  <ToggleColorMode />
</template>
