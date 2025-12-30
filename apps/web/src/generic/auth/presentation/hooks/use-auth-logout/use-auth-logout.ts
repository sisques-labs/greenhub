import { useAuth } from '@repo/sdk';
import { useRouter } from 'next/navigation';
import { useAppRoutes } from '@/shared/hooks/use-routes';

/**
 * Hook that provides logout functionality
 * Handles logout mutation and redirects to auth page
 */
export function useAuthLogout() {
  const router = useRouter();
  const { routes } = useAppRoutes();
  const { logout } = useAuth();

  const handleLogout = async (userId: string) => {
    try {
      // 01: Call logout mutation
      await logout.fetch({ id: userId });

      // 02: Redirect to auth page
      router.push(`${routes.auth}`);
    } catch (error) {
      // Error handling - even if logout fails on backend, we should still redirect
      console.error('Logout error:', error);
      router.push(`${routes.auth}`);
    }
  };

  return {
    handleLogout,
    isLoading: logout.loading,
    error: logout.error,
  };
}
