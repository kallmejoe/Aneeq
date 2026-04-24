<script setup lang="ts">
import { ref } from 'vue'
import UiAlert from '@core/components/ui/alert/Alert.vue'
import UiAlertDescription from '@core/components/ui/alert/AlertDescription.vue'
import UiButton from '@core/components/ui/Button.vue'
import UiInput from '@core/components/ui/Input.vue'
import UiLabel from '@core/components/ui/Label.vue'

const props = defineProps<{
  role: 'student' | 'professor' | 'instructor'
}>()

const email = ref('')
const password = ref('')
const name = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  
  try {
    const response = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        name: name.value,
        role: props.role
      }
    })
    
    if (response.success) {
      navigateTo('/login')
    } else {
      error.value = response.message || 'Signup failed'
    }
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Signup failed'
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
      <UiLabel for="name">Name</UiLabel>
      <UiInput id="name" v-model="name" type="text" placeholder="Your name" required />
    </div>
    
    <div class="field">
      <UiLabel for="email">Email</UiLabel>
      <UiInput id="email" v-model="email" type="email" placeholder="you@example.com" required />
    </div>
    
    <div class="field">
      <UiLabel for="password">Password</UiLabel>
      <UiInput id="password" v-model="password" type="password" placeholder="Password" required />
    </div>
    
    <UiButton type="submit" :disabled="loading" class="btn">
      {{ loading ? 'Signing up...' : 'Sign Up' }}
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