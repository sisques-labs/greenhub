import { useQuery } from '@tanstack/react-query';
import { plantSpeciesClient } from '../../api/client/plant-species.client';
import type { PlantSpeciesPaginationInput } from '../../api/types/plant-species-request.types';

/**
 * Hook for fetching verified plant species using TanStack Query
 */
export function usePlantSpeciesVerified(
  pagination?: PlantSpeciesPaginationInput,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: ['plant-species', 'list', 'verified', pagination],
    queryFn: () =>
      plantSpeciesClient.findAll({
        filters: [{ field: 'isVerified', operator: 'eq', value: true }],
        pagination,
      }),
    enabled,
  });

  return {
    plantSpecies: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
