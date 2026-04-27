<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

import { useAuth } from '@core/composables/useAuth'

const { isAuthenticated } = useAuth()
const router = useRouter()

onMounted(() => {
  if (isAuthenticated()) {
    router.push('/dashboard')
  }
})
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">Staff Login</h1>
      <p class="auth-subtitle">Log in to your staff account</p>
      <LoginForm />
      <p class="auth-link">
        Don't have an account? <NuxtLink to="/">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  width: 100%;
  padding: 1rem;
}

.auth-card {
  width: 100%;
  max-width: 22rem;
  margin: 0 auto;
}

.auth-title {
  margin: 0 0 0.25rem;
  color: var(--foreground);
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.auth-subtitle {
  margin: 0 0 1.5rem;
  color: var(--muted-foreground);
  text-align: center;
  font-size: 0.875rem;
}

.auth-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.auth-link a {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>