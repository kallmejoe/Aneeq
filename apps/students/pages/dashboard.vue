<script setup lang="ts">
import { useUser } from '@core/composables/useUser';
import { useAuth } from '@core/composables/useAuth';

definePageMeta({
  middleware: ['auth']
});

const user = useUser();
const { logout } = useAuth();
</script>

<template>
  <div class="dashboard-page">
    <header class="dashboard-header">
      <h1>Student Dashboard</h1>
      <div class="user-info">
        <span>Welcome, {{ user?.name }}</span>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </header>
    <main class="dashboard-content">
      <div class="dashboard-card">
        <h2>Dashboard Overview</h2>
        <p>Welcome to your student dashboard!</p>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Email:</span>
            <span>{{ user?.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">Role:</span>
            <span>{{ user?.role }}</span>
          </div>
          <div class="info-item">
            <span class="label">User ID:</span>
            <span>{{ user?.id }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: var(--background);
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.dashboard-header h1 {
  margin: 0;
  color: var(--foreground);
  font-size: 1.5rem;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.logout-btn:hover {
  opacity: 0.9;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.dashboard-card h2 {
  margin: 0 0 1rem;
  color: var(--foreground);
}

.dashboard-card > p {
  color: var(--muted-foreground);
  margin-bottom: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item .label {
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

.info-item span:last-child {
  color: var(--foreground);
  font-weight: 500;
}
</style>