import { useUser } from "@core/composables/useUser";

export default defineNuxtRouteMiddleware((to) => {
  const user = useUser();

  if (!user.value) {
    return navigateTo('/login');
  }

  const routeRole = to.path.startsWith('/students') ? 'student' :
                    to.path.startsWith('/staff') ? 'professor' :
                    to.path.startsWith('/instructors') ? 'instructor' : null;

  if (routeRole && user.value.role !== routeRole) {
    return navigateTo(`/${user.value.role}s/dashboard`);
  }
});