<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import { useUser } from '@core/composables/useUser'
import UiButton from '@core/components/ui/Button.vue'

const user = useUser()

const goToCourses = () => navigateTo('/courses')
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Student Dashboard</h1>
    <p class="dashboard-welcome">Welcome back, <strong>{{ user?.name }}</strong> 👋</p>

    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h2>Overview</h2>
        <p>You're all set! Explore your courses or check your progress below.</p>
        <div class="action-buttons">
          <UiButton class="dashboard-cta" @click="goToCourses">Course Enrollment</UiButton>
          <UiButton class="dashboard-cta" variant="outline" @click="navigateTo('/assignments')">My Assignments</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding-bottom: 2rem;
}

.dashboard-title {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--foreground);
}

.dashboard-welcome {
  margin: 0 0 2rem;
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
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.875rem;
  line-height: 1.6;
}

.dashboard-cta {
  margin-top: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
</style>