import { useUser, type User } from './useUser';

const ROLE_LABELS: Record<string, string> = {
  student: 'Student',
  professor: 'Instructor',
  admin: 'Staff'
};

const formatRoleLabel = (role: string) => {
  return ROLE_LABELS[role] || role.charAt(0).toUpperCase() + role.slice(1);
};

const formatAllowedRolesLabel = (roles?: string[]) => {
  if (!roles || roles.length === 0) return '';
  const labels = roles.map(formatRoleLabel);

  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} or ${labels[1]}`;

  return `${labels.slice(0, -1).join(', ')}, or ${labels[labels.length - 1]}`;
};

export const useAuth = () => {
  const user = useUser();
  const token = useCookie<string | null>('token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  });

  async function login(
    email: string,
    password: string,
    options?: { allowedRoles?: string[]; portalLabel?: string }
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await $fetch<{ success: boolean; user?: User; token?: string; message?: string }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: { email, password }
        }
      );

      if (response.success && response.user && response.token) {
        const allowedRoles = options?.allowedRoles?.filter(Boolean);
        if (allowedRoles?.length && !allowedRoles.includes(response.user.role)) {
          const portalLabel = options?.portalLabel || formatAllowedRolesLabel(allowedRoles);
          const roleLabel = formatRoleLabel(response.user.role);
          const prefix = portalLabel ? `This is the ${portalLabel} login.` : 'This login is restricted.';

          return {
            success: false,
            message: `${prefix} Please use the ${roleLabel} login for your account.`
          };
        }

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
