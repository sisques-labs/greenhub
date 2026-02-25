import { useQuery } from '@tanstack/react-query';
import { plantSpeciesClient } from '../../api/client/plant-species.client';
import type { PlantSpeciesCategory } from '../../api/types/plant-species.types';
import type { PlantSpeciesPaginationInput } from '../../api/types/plant-species-request.types';

/**
 * Hook for fetching plant species filtered by category using TanStack Query
 */
export function usePlantSpeciesByCategory(
  category: PlantSpeciesCategory,
  pagination?: PlantSpeciesPaginationInput,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: ['plant-species', 'list', 'category', category, pagination],
    queryFn: () =>
      plantSpeciesClient.findAll({
        filters: [{ field: 'category', operator: 'eq', value: category }],
        pagination,
      }),
    enabled: enabled && !!category,
  });

  return {
    plantSpecies: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
