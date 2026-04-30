<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: ['auth']
})

const token = useCookie('token')
const user = useUser()

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
      activeCourseIds.value = res.courses.map((c: any) => c.id)
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
      // Refresh enrollments and clear selection
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
    <h1 class="page-title">Available Courses</h1>
    
    <div class="actions" v-if="selectedCourseIds.length > 0">
      <Button @click="handleEnrollment">Register Selected Courses ({{ selectedCourseIds.length }})</Button>
      <Button variant="outline" @click="clearSelection">Clear Selection</Button>
    </div>

    <div class="course-list">
      <div v-for="course in courses" :key="course.id" class="course-card" :class="{ 'enrolled': isEnrolled(course.id) }">
        <div class="course-info">
          <h3>{{ course.name }}</h3>
          <p v-if="course.professor_name">Professor: {{ course.professor_name }}</p>
          <span v-if="isEnrolled(course.id)" class="badge">Already Enrolled</span>
        </div>
        <div class="course-action" v-if="!isEnrolled(course.id)">
          <label>
            <input type="checkbox" :value="course.id" v-model="selectedCourseIds" />
            Select
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.courses-page {
  padding: 1rem;
}
.page-title {
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
}
.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
.course-card {
  border: 1px solid var(--border, #ddd);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.course-card.enrolled {
  background-color: var(--muted, #f9f9f9);
  opacity: 0.8;
}
.course-info h3 {
  margin-top: 0;
  font-size: 1.25rem;
  font-weight: 600;
}
.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
.course-action {
  margin-top: 1rem;
  border-top: 1px solid var(--border, #eee);
  padding-top: 1rem;
}
.course-action label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}
</style>
