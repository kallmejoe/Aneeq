<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuth } from "@core/composables/useAuth";

definePageMeta({
  middleware: ["auth"],
});

const { token } = useAuth();

const allCourses = ref<any[]>([]);
const enrolledCourseIds = ref<number[]>([]);
const loading = ref(true);

const fetchAllCourses = async () => {
  try {
    const res = await $fetch("/api/courses/list-courses");
    if (res.success) {
      allCourses.value = res.courses.filter((course: any) => course.active);
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchEnrolledCourses = async () => {
  try {
    const res = await $fetch("/api/student/activeCourses", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (res.success) {
      enrolledCourseIds.value = res.courses.map((course: any) => course.id);
    }
  } catch (error) {
    console.error(error);
  }
};

const activeCourses = computed(() => {
  return allCourses.value.map((course: any) => ({
    ...course,
    isEnrolled: enrolledCourseIds.value.includes(course.id),
  }));
});

const enrolledCourses = computed(() => {
  return activeCourses.value.filter((course: any) => course.isEnrolled);
});

const availableCourses = computed(() => {
  return activeCourses.value.filter((course: any) => !course.isEnrolled);
});

onMounted(async () => {
  await Promise.all([fetchAllCourses(), fetchEnrolledCourses()]);
  loading.value = false;
});
</script>

<template>
  <div class="courses-page">
    <div class="page-header">
      <h1 class="page-title">Active Courses</h1>
      <p class="page-subtitle">
        View all active courses and your enrollment status.
      </p>
    </div>

    <div v-if="loading" class="loading">Loading courses...</div>

    <div v-else-if="activeCourses.length === 0" class="empty-state">
      <p>No active courses available.</p>
      <NuxtLink to="/enrollment" class="link">Browse all courses</NuxtLink>
    </div>

    <div v-else>
      <!-- My Enrolled Courses Section -->
      <div v-if="enrolledCourses.length > 0" class="courses-section">
        <h2 class="section-title">My Enrolled Courses</h2>
        <div class="course-list">
          <div
            v-for="course in enrolledCourses"
            :key="course.id"
            class="course-card enrolled"
          >
            <div class="course-content">
              <div class="course-info">
                <div class="course-header">
                  <h3 class="course-title">{{ course.name }}</h3>
                  <span class="badge badge--enrolled">Enrolled</span>
                </div>
                <p v-if="course.professor_name" class="course-professor">
                  {{ course.professor_name }}
                </p>
                <p v-if="course.description" class="course-description">
                  {{ course.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Courses Section -->
      <div v-if="availableCourses.length > 0" class="courses-section">
        <h2 class="section-title">Available Courses</h2>
        <div class="course-list">
          <div
            v-for="course in availableCourses"
            :key="course.id"
            class="course-card"
          >
            <div class="course-content">
              <div class="course-info">
                <div class="course-header">
                  <h3 class="course-title">{{ course.name }}</h3>
                  <span class="badge badge--available">Available</span>
                </div>
                <p v-if="course.professor_name" class="course-professor">
                  {{ course.professor_name }}
                </p>
                <p v-if="course.description" class="course-description">
                  {{ course.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.courses-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 100%;
}

.page-header {
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

.loading,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary, #666);
}

.empty-state p {
  margin-bottom: 1rem;
}

.link {
  display: inline-block;
  color: var(--color-primary, #3b82f6);
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.courses-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-primary, #3b82f6);
}

.course-list {
  display: grid;
  gap: 1rem;
}

.course-card {
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 6px;
  padding: 1.5rem;
  background: var(--color-surface, white);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.course-card:hover {
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-card.enrolled {
  border-color: var(--color-primary, #3b82f6);
  background: var(--color-primary-light, #eff6ff);
}

.course-content {
  width: 100%;
}

.course-info {
  min-width: 0;
}

.course-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.course-title {
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
  white-space: nowrap;
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
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary, #666);
  font-weight: 500;
}

.course-description {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary, #666);
  line-height: 1.5;
}
</style>
