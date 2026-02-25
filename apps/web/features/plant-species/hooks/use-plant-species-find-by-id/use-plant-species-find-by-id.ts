import { useQuery } from '@tanstack/react-query';
import { plantSpeciesClient } from '../../api/client/plant-species.client';

/**
 * Hook for fetching a single plant species by ID using TanStack Query
 */
export function usePlantSpeciesFindById(id: string, options?: { enabled?: boolean }) {
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: ['plant-species', 'detail', id],
    queryFn: () => plantSpeciesClient.findById({ id }),
    enabled: enabled && !!id,
  });

  return {
    plantSpecies: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
