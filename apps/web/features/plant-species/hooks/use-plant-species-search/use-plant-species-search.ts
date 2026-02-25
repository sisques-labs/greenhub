import { useQuery } from '@tanstack/react-query';
import { plantSpeciesClient } from '../../api/client/plant-species.client';
import type { PlantSpeciesPaginationInput } from '../../api/types/plant-species-request.types';

/**
 * Hook for searching plant species by name using TanStack Query
 */
export function usePlantSpeciesSearch(
  searchTerm: string,
  pagination?: PlantSpeciesPaginationInput,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: ['plant-species', 'list', 'search', searchTerm, pagination],
    queryFn: () =>
      plantSpeciesClient.findAll({
        filters: [{ field: 'commonName', operator: 'like', value: searchTerm }],
        pagination,
      }),
    enabled: enabled && !!searchTerm,
  });

  return {
    plantSpecies: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
