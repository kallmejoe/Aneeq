import { useUser, type User } from './useUser';

export const useAuth = () => {
  const user = useUser();
  const token = useCookie<string | null>('token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  });

  async function login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await $fetch<{ success: boolean; user?: User; token?: string; message?: string }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: { email, password }
        }
      );

      if (response.success && response.user && response.token) {
        token.value = response.token;
        user.value = response.user;
        return { success: true };
      }

      return { success: false, message: response.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.data?.message || err.message || 'Login failed' };
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    navigateTo('/login');
  }

  function isAuthenticated(): boolean {
    return !!user.value && !!token.value;
  }

  function hasRole(roles: string | string[]): boolean {
    if (!user.value) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.value.role);
  }

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    hasRole
  };
};