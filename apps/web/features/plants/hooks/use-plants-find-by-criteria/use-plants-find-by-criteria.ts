import { useQuery } from '@tanstack/react-query';
import { plantsApiClient } from '../../api/plants-api.client';
import type { PlantFindByCriteriaInput } from '../../api/types';

/**
 * Hook for fetching plants by criteria using TanStack Query
 * Replaces SDK's usePlants().findByCriteria with API client
 */
export function usePlantsFindByCriteria(
  input?: PlantFindByCriteriaInput,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: ['plants', 'list', input],
    queryFn: () => plantsApiClient.findByCriteria(input),
    enabled,
  });

  return {
    plants: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
