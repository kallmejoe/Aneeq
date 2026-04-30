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
      courses.value = res.courses
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

const handleEnrollment = async () => {
  if (selectedCourseIds.value.length === 0) return

  try {
    const res = await $fetch('/api/student/enroll', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        courseIds: selectedCourseIds.value
      }
    })

    if (res.success) {
      await fetchActiveCourses()
      selectedCourseIds.value = []
      alert('Successfully enrolled!')
    } else {
      alert(res.message || 'Error occurred')
    }
  } catch (error) {
    console.error(error)
    alert('Enrollment failed')
  }
}

const clearSelection = () => {
  selectedCourseIds.value = []
}

const isEnrolled = (courseId: number) => activeCourseIds.value.includes(courseId)
</script>

<template>
  <div class="courses-page">
    <div class="courses-toolbar">
      <div class="courses-heading">
        <h1 class="page-title">Available Courses</h1>
        <p class="page-subtitle">Select one or more courses, then enroll from the top right.</p>
      </div>

      <div class="actions">
        <UiButton :disabled="selectedCourseIds.length === 0" @click="handleEnrollment">
          Enroll Selected ({{ selectedCourseIds.length }})
        </UiButton>
        <UiButton variant="outline" :disabled="selectedCourseIds.length === 0" @click="clearSelection">
          Clear
        </UiButton>
      </div>
    </div>

    <div class="course-list">
      <div
        v-for="course in courses"
        :key="course.id"
        class="course-card"
        :class="{ enrolled: isEnrolled(course.id) }"
      >
        <label class="course-row">
          <div class="course-select">
            <input
              v-if="!isEnrolled(course.id)"
              v-model="selectedCourseIds"
              type="checkbox"
              :value="course.id"
            />
            <span v-else class="course-dot course-dot--enrolled"></span>
          </div>

          <div class="course-info">
            <div class="course-title-row">
              <h3>{{ course.name }}</h3>
              <span v-if="isEnrolled(course.id)" class="badge">Enrolled</span>
            </div>
            <p v-if="course.professor_name">{{ course.professor_name }}</p>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.courses-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100%;
}

.courses-toolbar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.75rem;
  background: var(--background);
}

.courses-heading {
  min-width: 0;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.page-subtitle {
  margin: 0.35rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.course-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card);
  padding: 0.9rem 1rem;
}

.course-card.enrolled {
  background: var(--muted, #f8f8f8);
}

.course-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
}

.course-select {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.5rem;
}

.course-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 999px;
  background: var(--border);
}

.course-dot--enrolled {
  background: #4caf50;
}

.course-info {
  min-width: 0;
  flex: 1;
}

.course-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.course-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.course-info p {
  margin: 0.25rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: rgba(76, 175, 80, 0.12);
  color: #2e7d32;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
