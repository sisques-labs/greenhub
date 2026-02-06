import { useQuery } from '@tanstack/react-query';
import { usersApiClient } from '../../api/users-api.client';

/**
 * Hook for fetching a single user by ID using TanStack Query
 * Replaces SDK's useUsers().findById with API client
 */
export function useUserFindById(id: string, options?: { enabled?: boolean }) {
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: () => usersApiClient.findById({ id }),
    enabled: enabled && !!id,
  });

  return {
    user: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
