<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UiButton from '@core/components/ui/Button.vue'
import { useAuth } from '@core/composables/useAuth'

definePageMeta({
  middleware: ['auth']
})

const { token } = useAuth()

const courses = ref<any[]>([])
const assignments = ref<any[]>([])

const assignmentForm = ref({
  course_id: '',
  title: '',
  description: '',
  max_score: 100,
  due_date: ''
})

const creatingAssignment = ref(false)
const assignmentError = ref('')
const assignmentSuccess = ref('')

const fetchCourses = async () => {
  try {
    const res = await $fetch('/api/courses/my-courses', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    if (res.success) {
      courses.value = res.courses
    }
  } catch (error) {
    console.error(error)
  }
}

const fetchAssignments = async () => {
  try {
    const res = await $fetch('/api/assignments/professor-assignments', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    if (res.success) {
      assignments.value = res.assignments
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await Promise.all([fetchCourses(), fetchAssignments()])
})

const createAssignment = async () => {
  creatingAssignment.value = true
  assignmentError.value = ''
  assignmentSuccess.value = ''

  // Format date to iso string if needed, or just pass as is
  const dueDate = new Date(assignmentForm.value.due_date)
  if (dueDate < new Date()) {
    assignmentError.value = 'Due date cannot be in the past'
    creatingAssignment.value = false
    return
  }

  try {
    const response = await $fetch('/api/assignments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        course_id: Number(assignmentForm.value.course_id),
        title: assignmentForm.value.title,
        description: assignmentForm.value.description,
        max_score: assignmentForm.value.max_score,
        due_date: assignmentForm.value.due_date
      }
    })

    if (response.success) {
      assignmentSuccess.value = 'Assignment created successfully!'
      assignmentForm.value = {
        course_id: '',
        title: '',
        description: '',
        max_score: 100,
        due_date: ''
      }
      await fetchAssignments()
    } else {
      assignmentError.value = response.message || 'Failed to create assignment'
    }
  } catch (err) {
    assignmentError.value = 'Failed to create assignment'
  } finally {
    creatingAssignment.value = false
  }
}

const getMinDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
}
</script>

<template>
  <div class="assignments-page">
    <div class="page-header">
      <h1 class="page-title">Manage Assignments</h1>
      <p class="page-subtitle">Create and view assignments for your courses.</p>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card form-card">
        <h2>Create New Assignment</h2>
        <form class="assignment-form" @submit.prevent="createAssignment">
          <div v-if="assignmentError" class="error-message">
            {{ assignmentError }}
          </div>
          <div v-if="assignmentSuccess" class="success-message">
            {{ assignmentSuccess }}
          </div>

          <div class="form-field">
            <label for="course-select">Course</label>
            <select id="course-select" v-model="assignmentForm.course_id" required>
              <option disabled value="">Select a course...</option>
              <option v-for="course in courses" :key="course.id" :value="course.id">
                {{ course.name }}
              </option>
            </select>
          </div>

          <div class="form-field">
            <label for="assignment-title">Title</label>
            <input
              id="assignment-title"
              v-model="assignmentForm.title"
              type="text"
              required
            >
          </div>

          <div class="form-field">
            <label for="assignment-description">Description</label>
            <textarea
              id="assignment-description"
              v-model="assignmentForm.description"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-field flex-1">
              <label for="assignment-score">Max Score</label>
              <input
                id="assignment-score"
                v-model.number="assignmentForm.max_score"
                type="number"
                min="0"
                step="0.1"
                required
              >
            </div>

            <div class="form-field flex-1">
              <label for="assignment-due">Due Date</label>
              <input
                id="assignment-due"
                v-model="assignmentForm.due_date"
                type="datetime-local"
                :min="getMinDateTime()"
                required
              >
            </div>
          </div>

          <div class="form-actions">
            <UiButton type="submit" :disabled="creatingAssignment">
              {{ creatingAssignment ? 'Creating...' : 'Create Assignment' }}
            </UiButton>
          </div>
        </form>
      </div>

      <div class="dashboard-card list-card">
        <h2>Your Assignments</h2>
        <div v-if="assignments.length === 0" class="empty-state">
          No assignments created yet.
        </div>
        <div v-else class="assignment-list">
          <div v-for="assignment in assignments" :key="assignment.id" class="assignment-item">
            <div class="assignment-header">
              <h3>{{ assignment.title }}</h3>
              <span class="course-badge">{{ assignment.course_name }}</span>
            </div>
            <p v-if="assignment.description" class="assignment-desc">{{ assignment.description }}</p>
            <div class="assignment-meta">
              <span><strong>Max Score:</strong> {{ assignment.max_score }}</span>
              <span class="due-date"><strong>Due:</strong> {{ formatDate(assignment.due_date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assignments-page {
  padding-bottom: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--foreground);
}

.page-subtitle {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.9375rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.dashboard-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.dashboard-card h2 {
  margin: 0 0 1.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--foreground);
}

.assignment-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.error-message {
  padding: 0.75rem;
  background: var(--destructive);
  color: var(--destructive-foreground);
  border-radius: var(--radius);
  font-size: 0.875rem;
}

.success-message {
  padding: 0.75rem;
  background: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
  border-radius: var(--radius);
  font-size: 0.875rem;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
}

.form-field input,
.form-field select,
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

.form-row {
  display: flex;
  gap: 1rem;
}

.flex-1 {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.assignment-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assignment-item {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  background: var(--background);
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.assignment-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.course-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-foreground);
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0.9;
}

.assignment-desc {
  margin: 0 0 1rem;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.assignment-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--foreground);
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;
}

.due-date {
  color: var(--destructive);
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--muted-foreground);
  background: var(--background);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
}
</style>
