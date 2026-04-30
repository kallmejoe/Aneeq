<script setup lang="ts">
import { ref } from 'vue'
import UiButton from '@core/components/ui/Button.vue'
import { useUser } from '@core/composables/useUser'
import { useAuth } from '@core/composables/useAuth'

definePageMeta({
  middleware: ['auth']
})

const user = useUser()
const { logout, token } = useAuth()

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
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        name: courseForm.value.name,
        description: courseForm.value.description,
        active: courseForm.value.active
      }
    })

    if (response.success) {
      showCreateCourseModal.value = false
      courseForm.value = {
        name: '',
        description: '',
        active: true
      }
    } else {
      createCourseError.value = response.message || 'Failed to create course'
    }
  } catch (err) {
    createCourseError.value = 'Failed to create course'
  } finally {
    creatingCourse.value = false
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Instructor Dashboard</h1>
      <p class="dashboard-welcome">Welcome back, <strong>{{ user?.name }}</strong></p>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h2>Account Info</h2>
        <p><strong>Email:</strong> {{ user?.email }}</p>
        <p><strong>Role:</strong> {{ user?.role }}</p>
      </div>

      <div class="dashboard-card dashboard-card--action">
        <h2>Quick Actions</h2>
        <UiButton @click="showCreateCourseModal = true">
          Create Course
        </UiButton>
      </div>
    </div>

    <div
      v-if="showCreateCourseModal"
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-course-title"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="create-course-title">Create Course</h2>
          <button
            type="button"
            aria-label="Close dialog"
            class="modal-close"
            @click="showCreateCourseModal = false"
          >
            ×
          </button>
        </div>

        <form class="modal-form" @submit.prevent="createCourse">
          <div v-if="createCourseError" class="error-message">
            {{ createCourseError }}
          </div>

          <div class="form-field">
            <label for="course-name">Course Name</label>
            <input
              id="course-name"
              v-model="courseForm.name"
              type="text"
              required
            >
          </div>

          <div class="form-field">
            <label for="course-description">Description</label>
            <textarea
              id="course-description"
              v-model="courseForm.description"
            ></textarea>
          </div>

          <div class="form-field form-field--checkbox">
            <input id="course-active" v-model="courseForm.active" type="checkbox" name="active">
            <label for="course-active">Active</label>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="showCreateCourseModal = false"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="btn-primary"
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

<style scoped>
.dashboard {
  padding-bottom: 2rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--foreground);
}

.dashboard-welcome {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.9375rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.dashboard-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
}

.dashboard-card h2 {
  margin: 0 0 0.5rem;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--foreground);
}

.dashboard-card p {
  margin: 0.25rem 0;
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 28rem;
  background: var(--background);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--foreground);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--muted-foreground);
  cursor: pointer;
  line-height: 1;
}

.modal-close:hover {
  color: var(--foreground);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  padding: 0.75rem;
  background: var(--destructive);
  color: var(--destructive-foreground);
  border-radius: var(--radius);
  font-size: 0.875rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
}

.form-field input[type="text"],
.form-field input[type="email"],
.form-field input[type="password"],
.form-field textarea {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--background);
  color: var(--foreground);
  font-size: 0.875rem;
}

.form-field textarea {
  min-height: 5rem;
  resize: vertical;
}

.form-field--checkbox {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.form-field--checkbox input {
  width: 1rem;
  height: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--accent);
}
</style>