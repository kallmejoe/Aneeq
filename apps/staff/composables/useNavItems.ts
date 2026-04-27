// apps/staff/composables/useNavItems.ts
// Overrides the core useNavItems to provide staff-specific nav links.
import type { NavItem } from '@core/composables/useNavItems'

export const useNavItems = (): NavItem[] => {
  return [
    { id: 'dashboard', href: '/dashboard', label: 'Dashboard' },
    { id: 'students', href: '/students', label: 'Students' },
    { id: 'courses', href: '/courses', label: 'Courses' },
  ]
}
