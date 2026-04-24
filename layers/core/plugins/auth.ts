export default defineNuxtPlugin(async () => {
  const token = useCookie('token');
  const user = useUser();

  if (!token.value) return;

  try {
    const response = await $fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });

    if (response.success && response.user) {
      user.value = response.user;
    }
  } catch {
    token.value = null;
    user.value = null;
  }
});