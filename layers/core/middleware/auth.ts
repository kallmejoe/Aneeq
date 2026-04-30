import { useUser } from "@core/composables/useUser";

export default defineNuxtRouteMiddleware(() => {
  const user = useUser();

  if (!user.value) {
    return navigateTo('/login');
  }
});
