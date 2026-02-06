import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApiClient } from '../../api/auth-api.client';
import { useAppRoutes } from '@/shared/hooks/use-routes';

/**
 * Hook for logout functionality using TanStack Query
 * Clears all cached data and redirects to auth page
 */
export function useAuthLogout() {
  const router = useRouter();
  const { routes } = useAppRoutes();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) => authApiClient.logout({ userId }),
    onSuccess: () => {
      // Clear all cached queries
      queryClient.clear();
      // Redirect to auth page
      router.push(routes.auth);
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even if logout fails on backend, clear cache and redirect
      queryClient.clear();
      router.push(routes.auth);
    },
  });

  return {
    handleLogout: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
