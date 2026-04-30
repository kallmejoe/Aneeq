<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UiNavbar from '@core/components/ui/Navbar.vue'
import UserProfile from '@core/components/UserProfile.vue'

const route = useRoute()
const navItems = useNavItems()

const isAuthPage = computed(() => {
  const path = route.path
  return path === '/login' || path === '/signup' || path === '/register' || path === '/'
})
</script>

<template>
  <div class="app-layout">
    <header v-if="!isAuthPage" class="app-header">
      <div class="header-container">
        <UiNavbar :nav-items="navItems" />
        <UserProfile />
      </div>
    </header>

    <main class="app-main" :class="{ 'app-main--full': isAuthPage }">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--background);
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--background);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.header-container {
  width: 75%;
  max-width: 75%;
  margin: 0 auto;
  padding: 0.75rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  width: 75%;
  max-width: 75%;
  margin: 0 auto;
  padding: 2rem 0;
}

.app-main--full {
  width: 100%;
  max-width: 100%;
}

@media (max-width: 768px) {
  .header-container,
  .app-main {
    width: 100%;
    max-width: 100%;
    padding: 0.75rem 1rem;
  }

  .app-main {
    padding-top: 1.5rem;
  }
}
</style>