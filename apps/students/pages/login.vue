<script setup lang="ts">
// eslint-disable-next-line vue/multi-word-component-names
import LoginForm from '../../../layers/core/components/LoginForm.vue';
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <h1 class="login-title">Login</h1>
      <LoginForm />
      <p class="signup-link">
        Don't have an account? <NuxtLink to="/">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--background);
}

.login-container {
  width: 100%;
  max-width: 20rem;
}

.login-title {
  margin: 0 0 1.5rem;
  color: var(--foreground);
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.signup-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.signup-link a {
  color: var(--primary);
  text-decoration: underline;
}
</style>