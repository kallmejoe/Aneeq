<script setup lang="ts">
import SignupForm from '../../../layers/core/components/SignupForm.vue';
</script>

<template>
  <div class="signup-page">
    <div class="signup-container">
      <h1 class="signup-title">Signup</h1>
      <SignupForm role="student" />
    </div>
  </div>
</template>

<style scoped>
.signup-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--background);
}

.signup-container {
  width: 100%;
  max-width: 20rem;
}

.signup-title {
  margin: 0 0 1.5rem;
  color: var(--foreground);
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
}
</style>