import { useUser } from "@core/composables/useUser";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser();
  const token = useCookie('token');

  if (!token.value && !user.value) {
    return navigateTo('/login');
  }

  if (token.value && !user.value) {
    try {
      const response = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });

      if (response.success && response.user) {
        user.value = response.user;
      } else {
        token.value = null;
        return navigateTo('/login');
      }
    } catch {
      token.value = null;
      return navigateTo('/login');
    }
  }

  const routeRole = to.path.startsWith('/students') ? 'student' :
                    to.path.startsWith('/staff') ? 'professor' :
                    to.path.startsWith('/instructors') ? 'instructor' : null;

  if (routeRole && user.value.role !== routeRole) {
    return navigateTo(`/${user.value.role}s/dashboard`);
  }
});