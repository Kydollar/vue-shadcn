<script lang="ts" setup>
import { ref } from 'vue'

import GitHubButton from './github-button.vue'
import GoogleButton from './google-button.vue'
import PrivacyPolicyButton from './privacy-policy-button.vue'
import TermsOfServiceButton from './terms-of-service-button.vue'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
</script>

<template>
  <UiCard class="w-full max-w-sm">
    <form>
      <UiCardHeader>
        <UiCardTitle class="text-2xl">
          Sign Up
        </UiCardTitle>
        <UiCardDescription>
          Enter your username, email, and password to create an account.
          Already have an account?
          <UiButton variant="link" class="px-0 text-muted-foreground" @click.prevent="$router.push('/auth/sign-in')">
            Sign In
          </UiButton>
        </UiCardDescription>
      </UiCardHeader>

      <UiCardContent class="grid gap-4">
        <div v-if="errorMsg" class="text-red-500 text-sm">
          {{ errorMsg }}
        </div>

        <div class="grid gap-2">
          <UiLabel for="username">
            Username
          </UiLabel>
          <UiInput id="username" v-model="username" required placeholder="your username" />
        </div>

        <div class="grid gap-2">
          <UiLabel for="email">
            Email
          </UiLabel>
          <UiInput id="email" v-model="email" type="email" required placeholder="your@email.com" />
        </div>

        <div class="grid gap-2">
          <UiLabel for="password">
            Password
          </UiLabel>
          <UiInput id="password" v-model="password" type="password" required placeholder="*********" />
        </div>

        <div class="grid gap-2">
          <UiLabel for="confirm-password">
            Confirm Password
          </UiLabel>
          <UiInput id="confirm-password" v-model="confirmPassword" type="password" required placeholder="*********" />
        </div>

        <!-- <UiButton class="w-full" type="submit" :disabled="isPending">
          <span v-if="isPending">Creating account...</span>
          <span v-else>Create Account</span>
        </UiButton> -->

        <UiSeparator label="Or continue with" />

        <div class="flex flex-col gap-4">
          <GitHubButton />
          <GoogleButton />
        </div>

        <UiCardDescription>
          By creating an account, you agree to our
          <TermsOfServiceButton /> and <PrivacyPolicyButton />
        </UiCardDescription>
      </UiCardContent>
    </form>
  </UiCard>
</template>
