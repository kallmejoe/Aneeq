<script setup lang="ts">
import { ref } from 'vue'
import UiAlert from '@core/components/ui/alert/Alert.vue'
import UiAlertDescription from '@core/components/ui/alert/AlertDescription.vue'
import UiButton from '@core/components/ui/Button.vue'
import UiInput from '@core/components/ui/Input.vue'
import UiLabel from '@core/components/ui/Label.vue'
import { useAuth } from '@core/composables/useAuth'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const { login } = useAuth()

async function handleSubmit() {
  error.value = ''
  loading.value = true
  
  try {
    const result = await login(email.value, password.value)
    
    if (result.success) {
      await navigateTo('/dashboard')
    } else {
      error.value = result.message || 'Login failed'
    }
  } catch (err: unknown) {
    error.value = (err as Error).message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <UiAlert v-if="error" variant="destructive">
      <UiAlertDescription>{{ error }}</UiAlertDescription>
    </UiAlert>
    
    <div class="field">
      <UiLabel for="email">Email</UiLabel>
      <UiInput id="email" v-model="email" type="email" placeholder="you@example.com" required />
    </div>
    
    <div class="field">
      <UiLabel for="password">Password</UiLabel>
      <UiInput id="password" v-model="password" type="password" placeholder="Password" required />
    </div>
    
    <UiButton type="submit" :disabled="loading" class="btn">
      {{ loading ? 'Logging in...' : 'Log In' }}
    </UiButton>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.btn {
  width: 100%;
}
</style>