<script setup lang="ts">
import { useAuth } from "@core/composables/useAuth";
import SignupForm from "@core/components/SignupForm.vue";

definePageMeta({
  layout: "auth",
});

const { isAuthenticated } = useAuth();
const router = useRouter();

onMounted(() => {
  if (isAuthenticated()) {
    router.push("/dashboard");
  }
});
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">Create your account</h1>
      <p class="auth-subtitle">Sign up as an instructor</p>
      <SignupForm role="professor" />
      <p class="auth-link">
        Already have an account? <NuxtLink to="/login">Log in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-md);
  background: linear-gradient(
    135deg,
    var(--color-base) 0%,
    var(--color-primary) 100%
  );
}

.auth-card {
  background: var(--color-surface, white);
  padding: var(--spacing-lg);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
  text-align: center;
}

.auth-subtitle {
  color: var(--color-text-secondary, #666);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  font-size: 0.95rem;
}

.auth-link {
  text-align: center;
  margin-top: var(--spacing-md);
  color: var(--color-text);
  font-size: 0.9rem;
}

.auth-link a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
