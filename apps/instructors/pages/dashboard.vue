<script setup lang="ts">
import { ref } from 'vue';
import { useUser } from '@core/composables/useUser';
import { useAuth } from '@core/composables/useAuth';

definePageMeta({
  middleware: ['auth']
});

const user = useUser();
const { logout } = useAuth();

const showCreateCourseModal = ref(false)


const courseForm = ref({
  name: '',
  description: '',
  active: true
})

const creatingCourse = ref(false)
const createCourseError = ref('')

async function createCourse() {
  creatingCourse.value = true
  createCourseError.value = ''

  try {
    const response = await $fetch('/api/courses', {
      method: 'POST',
      body: {
        name: courseForm.value.name,
        description: courseForm.value.description,
        active: courseForm.value.active,
        professor_id: user.value?.id
      }
    })

    console.log(response)

    showCreateCourseModal.value = false

    courseForm.value = {
      name: '',
      description: '',
      active: true
    }
  } catch (err) {
    createCourseError.value = 'Failed to create course'
  } finally {
    creatingCourse.value = false
  }
}




</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Instructor Dashboard</h1>
          <div class="flex items-center gap-4">
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              @click="showCreateCourseModal = true"
            >
              Create Course
            </button>
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

    <div
      v-if="showCreateCourseModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold">Create Course</h2>
          <button
            type="button"
            class="text-2xl leading-none text-gray-500 hover:text-gray-700"
            @click="showCreateCourseModal = false"
          >
            &times;
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="createCourse">
          <div v-if="createCourseError" class="rounded border border-red-200 bg-red-50 px-3 py-2 text-red-600">
            {{ createCourseError }}
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              v-model="courseForm.name"
              class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="text"
              required
            >
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="courseForm.description"
              class="min-h-28 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <label class="flex items-center gap-2 text-sm text-gray-700">
            <input v-model="courseForm.active" type="checkbox">
            Active
          </label>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              @click="showCreateCourseModal = false"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="creatingCourse"
            >
              {{ creatingCourse ? 'Creating...' : 'Create Course' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
