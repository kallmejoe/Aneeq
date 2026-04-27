<script setup lang="ts">
import { useUser } from '@core/composables/useUser';

definePageMeta({
  middleware: ['auth']
});

const user = useUser();
const { logout } = useAuth();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Instructor Dashboard</h1>
          <div class="flex items-center gap-4">
            <span class="text-gray-600">Welcome, {{ user?.name }}</span>
            <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" @click="logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
    <main class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <p class="text-gray-600 mb-6">Welcome to the instructor dashboard!</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 border rounded-lg">
            <span class="text-sm text-gray-500">Email</span>
            <p class="font-medium">{{ user?.email }}</p>
          </div>
          <div class="p-4 border rounded-lg">
            <span class="text-sm text-gray-500">Role</span>
            <p class="font-medium">{{ user?.role }}</p>
          </div>
          <div class="p-4 border rounded-lg">
            <span class="text-sm text-gray-500">User ID</span>
            <p class="font-medium">{{ user?.id }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>