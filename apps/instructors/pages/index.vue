<script setup lang="ts">
import SignupForm from '../../../layers/core/components/SignupForm.vue';
import { useAuth } from '@core/composables/useAuth';

definePageMeta({
  layout: false
});

const { isAuthenticated } = useAuth();
const router = useRouter();

onMounted(() => {
  if (isAuthenticated()) {
    router.push('/dashboard');
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">Instructor Signup</h1>
        <div class="bg-white rounded-lg shadow p-6">
          <SignupForm role="professor" />
          <p class="mt-4 text-center text-sm text-gray-600">
            Already have an account? <NuxtLink to="/login" class="text-blue-600 hover:underline">Login</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
