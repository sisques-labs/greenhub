import { useQuery } from '@tanstack/react-query';
import { plantsApiClient } from '../../api/plants-api.client';

/**
 * Hook for fetching a single plant by ID using TanStack Query
 * Replaces SDK's usePlants().findById with API client
 */
export function usePlantFindById(id: string, options?: { enabled?: boolean }) {
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: ['plants', 'detail', id],
    queryFn: () => plantsApiClient.findById({ id }),
    enabled: enabled && !!id,
  });

  return {
    plant: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
