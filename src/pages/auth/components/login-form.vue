<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useLoginMutation } from '@/composables/auth/useLoginMutation'

// Assuming these are specific login-related components
import GitHubButton from './github-button.vue'
import GoogleButton from './google-button.vue'
import PrivacyPolicyButton from './privacy-policy-button.vue'
import TermsOfServiceButton from './terms-of-service-button.vue'
import ToForgotPasswordLink from './to-forgot-password-link.vue'

const router = useRouter()

const identifier = ref('emilys')
const password = ref('emilyspass')

const {
  mutateAsync: loginMutateAsync,
  isPending,
  isError,
  error,
} = useLoginMutation()

/**
 * Handles the login process.
 * Determines if the identifier is an email or username and
 * sends the appropriate payload to the login mutation.
 * Redirects to the dashboard on success, otherwise logs the error.
 */
async function handleLogin() {
  const isEmail = identifier.value.includes('@')
  const payload = {
    [isEmail ? 'email' : 'username']: identifier.value,
    password: password.value,
  }

  await loginMutateAsync(payload)
  router.replace('/dashboard')
}

/**
 * Computes the error message to display to the user.
 * Returns null if there's no error, otherwise extracts the message
 * from the Axios error response or provides a generic message.
 */
const errorMsg = computed(() => {
  if (!isError.value) {
    return null
  }
  // Type assertion for error.value to AxiosError for correct type inference
  const axiosError = error.value as import('axios').AxiosError<{ message?: string }>
  return axiosError.response?.data?.message || 'Login failed. Please try again.'
})
</script>

<template>
  <UiCard class="w-full max-w-sm">
    <form @submit.prevent="handleLogin">
      <UiCardHeader>
        <UiCardTitle class="text-2xl">
          Login
        </UiCardTitle>
        <UiCardDescription>
          Enter your email or username and password below to log into your account.
          Not have an account?
          <UiButton variant="link" class="px-0 text-muted-foreground" @click.prevent="$router.push('/auth/sign-up')">
            Sign Up
          </UiButton>
        </UiCardDescription>
      </UiCardHeader>

      <UiCardContent class="grid gap-4">
        <div v-if="errorMsg" class="text-red-500 text-sm">
          {{ errorMsg }}
        </div>

        <div class="grid gap-2">
          <UiLabel for="identifier">
            Email or Username
          </UiLabel>
          <UiInput id="identifier" v-model="identifier" required placeholder="your@email.com or username" />
        </div>

        <div class="grid gap-2">
          <div class="flex items-center justify-between">
            <UiLabel for="password">
              Password
            </UiLabel>
            <ToForgotPasswordLink />
          </div>
          <UiInput id="password" v-model="password" type="password" required placeholder="*********" />
        </div>

        <UiButton class="w-full" type="submit" :disabled="isPending">
          <span v-if="isPending">Logging in...</span>
          <span v-else>Login</span>
        </UiButton>

        <UiSeparator label="Or continue with" />

        <div class="flex flex-col gap-4">
          <GitHubButton />
          <GoogleButton />
        </div>

        <UiCardDescription>
          By clicking login, you agree to our
          <TermsOfServiceButton /> and <PrivacyPolicyButton />
        </UiCardDescription>
      </UiCardContent>
    </form>
  </UiCard>
</template>
