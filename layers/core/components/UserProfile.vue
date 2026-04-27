<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUser } from '@core/composables/useUser'
import { useAuth } from '@core/composables/useAuth'

const user = useUser()
const { logout } = useAuth()
const open = ref(false)

const initials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

function toggleDropdown() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function handleLogout() {
  close()
  logout()
}
</script>

<template>
  <div class="user-profile" @keydown.escape="close">
    <button
      class="avatar-btn"
      :aria-expanded="open"
      aria-haspopup="true"
      aria-label="User menu"
      @click="toggleDropdown"
    >
      <span class="avatar">{{ initials }}</span>
      <span class="user-name">{{ user?.name }}</span>
      <span class="chevron" :class="{ 'chevron--open': open }">▾</span>
    </button>

    <transition name="dropdown">
      <div v-if="open" class="dropdown" role="menu">
        <div class="dropdown-header">
          <span class="avatar avatar--lg">{{ initials }}</span>
          <div class="dropdown-user-info">
            <p class="dropdown-name">{{ user?.name }}</p>
            <p class="dropdown-email">{{ user?.email }}</p>
          </div>
        </div>
        <div class="dropdown-divider" />
        <div class="dropdown-details">
          <div class="detail-row">
            <span class="detail-label">Role</span>
            <span class="detail-value detail-badge">{{ user?.role }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ID</span>
            <span class="detail-value">#{{ user?.id }}</span>
          </div>
        </div>
        <div class="dropdown-divider" />
        <button class="dropdown-item dropdown-item--danger" role="menuitem" @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out
        </button>
      </div>
    </transition>

    <!-- Click outside to close -->
    <div v-if="open" class="dropdown-backdrop" @click="close" />
  </div>
</template>

<style scoped>
.user-profile {
  position: relative;
  display: inline-block;
}

.avatar-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: calc(var(--radius) - 2px);
  color: var(--foreground);
  transition: background-color 0.15s ease;
}

.avatar-btn:hover {
  background: var(--accent);
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--primary);
  color: var(--primary-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.avatar--lg {
  width: 2.75rem;
  height: 2.75rem;
  font-size: 1rem;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  font-size: 0.75rem;
  color: var(--muted-foreground);
  transition: transform 0.2s ease;
}

.chevron--open {
  transform: rotate(180deg);
}

/* Dropdown */
.dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 220px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  overflow: hidden;
}

.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
}

.dropdown-user-info {
  min-width: 0;
}

.dropdown-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-email {
  margin: 0.125rem 0 0;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-divider {
  height: 1px;
  background: var(--border);
}

.dropdown-details {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--muted-foreground);
}

.detail-value {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--foreground);
}

.detail-badge {
  background: var(--secondary);
  color: var(--secondary-foreground);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  text-transform: capitalize;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--foreground);
  text-align: left;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background: var(--accent);
}

.dropdown-item--danger {
  color: var(--destructive);
}

.dropdown-item--danger:hover {
  background: oklch(from var(--destructive) l c h / 0.08);
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
