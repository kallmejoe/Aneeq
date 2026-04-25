export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export const useUser = () => {
  return useState<User | null>('user', () => null);
};