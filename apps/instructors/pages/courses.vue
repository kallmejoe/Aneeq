<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const token = useCookie("token");

const courses = ref<any[]>([]);
const myCourseIds = ref<number[]>([]);

const fetchCourses = async () => {
  try {
    const res = await $fetch("/api/courses/list-courses");
    if (res.success) {
      courses.value = res.courses;
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchMyCourses = async () => {
  try {
    const res = await $fetch("/api/courses/my-courses", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (res.success) {
      myCourseIds.value = res.courses.map((course: any) => course.id);
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await Promise.all([fetchCourses(), fetchMyCourses()]);
});

const isTeaching = (courseId: number) => myCourseIds.value.includes(courseId);
</script>

<template>
  <div class="courses-page">
    <div class="courses-heading">
      <h1 class="page-title">All Courses</h1>
      <p class="page-subtitle">
        View available courses. Courses marked as "Teaching" are yours.
      </p>
    </div>

    <div class="course-list">
      <div
        v-for="course in courses"
        :key="course.id"
        class="course-card"
        :class="{ teaching: isTeaching(course.id) }"
      >
        <div class="course-row">
          <div class="course-indicator">
            <span v-if="isTeaching(course.id)" class="badge badge--teaching"
              >Teaching</span
            >
          </div>

          <div class="course-info">
            <div class="course-title-row">
              <h3>{{ course.name }}</h3>
            </div>
            <p v-if="course.professor_name">{{ course.professor_name }}</p>
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
  gap: 1rem;
  min-height: 100%;
}

.courses-heading {
  position: sticky;
  top: 0;
  z-index: 5;
  padding-bottom: 0.75rem;
  background: var(--background);
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
  cursor: default;
}

.course-card:hover {
  border-color: var(--color-primary, #3b82f6);
  background: var(--color-hover, #f9fafb);
}

.course-card.teaching {
  border-color: var(--color-primary, #3b82f6);
  background: var(--color-primary-light, #eff6ff);
}

.course-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.course-indicator {
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-info {
  flex: 1;
  min-width: 0;
}

.course-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.course-title-row h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.course-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary, #666);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background: var(--color-primary, #3b82f6);
  color: white;
}

.badge--teaching {
  background: var(--color-primary, #3b82f6);
  color: white;
}
</style>
