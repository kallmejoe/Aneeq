// apps/instructors/composables/useNavItems.ts
// Overrides the core useNavItems to provide instructor-specific nav links.
import type { NavItem } from '@core/composables/useNavItems'

export const useNavItems = (): NavItem[] => {
  return [
    { id: 'dashboard', href: '/dashboard', label: 'Dashboard' },
    { id: 'courses', href: '/courses', label: 'Courses' },
  ]
}