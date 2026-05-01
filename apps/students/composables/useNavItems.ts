// apps/students/composables/useNavItems.ts
// Overrides the core useNavItems to provide student-specific nav links.
import type { NavItem } from "@core/composables/useNavItems";

export const useNavItems = (): NavItem[] => {
  return [
    { id: "dashboard", href: "/dashboard", label: "Dashboard" },
    { id: "active-courses", href: "/active-courses", label: "My Courses" },
    { id: "enrollment", href: "/enrollment", label: "Enrollment" },
  ];
};
