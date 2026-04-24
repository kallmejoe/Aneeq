<template>
  <!-- eslint-disable-next-line vue/multi-word-component-names -->
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">Login</h1>
        <div class="bg-white rounded-lg shadow p-6">
          <LoginForm />
          <p class="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <NuxtLink to="/" class="text-blue-600 hover:underline">Sign up</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>