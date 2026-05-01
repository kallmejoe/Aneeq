<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UiButton from '@core/components/ui/Button.vue'

definePageMeta({
  middleware: ['auth']
})

const token = useCookie('token')

const courses = ref<any[]>([])
const activeCourseIds = ref<number[]>([])
const selectedCourseIds = ref<number[]>([])

const fetchCourses = async () => {
  try {
    const res = await $fetch('/api/courses/list-courses')
    if (res.success) {
      courses.value = res.courses.filter((course: any) => course.active)
    }
  } catch (error) {
    console.error(error)
  }
}

const fetchActiveCourses = async () => {
  try {
    const res = await $fetch('/api/student/activeCourses', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (res.success) {
      activeCourseIds.value = res.courses.map((course: any) => course.id)
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await Promise.all([fetchCourses(), fetchActiveCourses()])
})

const handleEnrollment = async (courseId: number) => {
  try {
    const res = await $fetch('/api/student/enroll', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        courseIds: [courseId]
      }
    })

    if (res.success) {
      await fetchActiveCourses()
      alert('Successfully enrolled!')
    } else {
      alert(res.message || 'Error occurred')
    }
  } catch (error) {
    console.error(error)
    alert('Enrollment failed')
  }
}

const isEnrolled = (courseId: number) => activeCourseIds.value.includes(courseId)
</script>

<template>
  <div class="enrollment-page">
    <div class="enrollment-header">
      <h1 class="page-title">Enrollment</h1>
      <p class="page-subtitle">Browse available courses and enroll in the ones you're interested in.</p>
    </div>

    <div class="course-list">
      <div
        v-for="course in courses"
        :key="course.id"
        class="course-card"
        :class="{ enrolled: isEnrolled(course.id) }"
      >
        <div class="course-row">
          <div class="course-info">
            <div class="course-title-row">
              <h3>{{ course.name }}</h3>
              <span v-if="isEnrolled(course.id)" class="badge badge--enrolled">Enrolled</span>
              <span v-else class="badge badge--available">Available</span>
            </div>
            <p v-if="course.professor_name" class="course-professor">{{ course.professor_name }}</p>
            <p v-if="course.description" class="course-description">{{ course.description }}</p>
          </div>

          <div class="course-action">
            <UiButton
              v-if="!isEnrolled(course.id)"
              @click="handleEnrollment(course.id)"
            >
              Enroll
            </UiButton>
            <span v-else class="enrolled-indicator">Enrolled</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.enrollment-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 100%;
}

.enrollment-header {
  padding-bottom: 0.75rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: var(--color-text-secondary, #666);
  margin: 0;
}

.course-list {
  display: grid;
  gap: 0.75rem;
}

.course-card {
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 6px;
  padding: 1rem;
  background: var(--color-surface, white);
  transition: all 0.2s ease;
}

.course-card:hover {
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.course-card.enrolled {
  border-color: var(--color-primary, #3b82f6);
  background: var(--color-primary-light, #eff6ff);
}

.course-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.course-info {
  flex: 1;
  min-width: 0;
}

.course-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.course-title-row h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge--enrolled {
  background: var(--color-primary, #3b82f6);
  color: white;
}

.badge--available {
  background: var(--color-secondary, #e5e7eb);
  color: var(--color-text);
}

.course-professor {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary, #666);
  font-weight: 500;
}

.course-description {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-secondary, #666);
  line-height: 1.4;
}

.course-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.enrolled-indicator {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: var(--color-primary, #3b82f6);
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>
