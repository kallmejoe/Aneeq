// layers/core/composables/useNavItems.ts
// Each app overrides this file in their own composables/ folder
// to provide app-specific navigation items.
// The core default is an empty array (no nav links).

export interface NavItem {
  id: string
  href: string
  label: string
}

export const useNavItems = (): NavItem[] => {
  return []
}
