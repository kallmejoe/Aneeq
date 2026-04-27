<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { NavItem } from '@core/composables/useNavItems'

const props = defineProps<{
  navItems: NavItem[]
}>()

const route = useRoute()
const router = useRouter()
const isOpen = ref(false)

const activeItem = computed(() => {
  const pathname = route.path

  for (const item of props.navItems) {
    if (item.href === '/') {
      if (pathname === '/') return item.id
    } else if (pathname.startsWith(item.href)) {
      return item.id
    }
  }

  return props.navItems[0]?.id || ''
})

const navigate = (href: string) => {
  isOpen.value = false
  router.push(href)
}
</script>

<template>
  <div class="navbar">
    <!-- Desktop nav -->
    <nav class="navbar-desktop" aria-label="Primary navigation">
      <NuxtLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.href"
        :class="[
          'navbar-link',
          activeItem === item.id ? 'navbar-link--active' : ''
        ]"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.navbar {
  position: relative;
  display: flex;
  align-items: center;
}

/* Desktop */
.navbar-desktop {
  display: none;
  align-items: center;
  gap: 0.25rem;
}

@media (min-width: 640px) {
  .navbar-desktop {
    display: flex;
  }

  .navbar-toggle {
    display: none;
  }
}

.navbar-link {
  white-space: nowrap;
  border-radius: 9999px;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  color: var(--muted-foreground);
  transition: color 0.15s ease, border-color 0.15s ease;
}

.navbar-link:hover {
  color: var(--foreground);
}

.navbar-link--active {
  color: var(--accent-foreground);
  border-color: var(--border);
}

/* Mobile */
.navbar-toggle {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  color: var(--muted-foreground);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.navbar-toggle:hover {
  background: var(--accent);
  color: var(--foreground);
}

.hamburger-line {
  display: block;
  width: 16px;
  height: 1px;
  background: currentColor;
}

.navbar-mobile {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 10rem;
  border-radius: calc(var(--radius) + 2px);
  border: 1px solid var(--border);
  background: var(--background);
  padding: 0.5rem;
  z-index: 50;
}

.navbar-mobile-item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: calc(var(--radius) - 2px);
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  color: var(--muted-foreground);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.navbar-mobile-item:hover {
  color: var(--foreground);
  background: var(--accent);
}

.navbar-mobile-item--active {
  color: var(--accent-foreground);
}
</style>