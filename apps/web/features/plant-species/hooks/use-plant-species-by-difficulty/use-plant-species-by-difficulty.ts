import { useQuery } from '@tanstack/react-query';
import { plantSpeciesClient } from '../../api/client/plant-species.client';
import type { PlantSpeciesDifficulty } from '../../api/types/plant-species.types';
import type { PlantSpeciesPaginationInput } from '../../api/types/plant-species-request.types';

/**
 * Hook for fetching plant species filtered by difficulty using TanStack Query
 */
export function usePlantSpeciesByDifficulty(
  difficulty: PlantSpeciesDifficulty,
  pagination?: PlantSpeciesPaginationInput,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: ['plant-species', 'list', 'difficulty', difficulty, pagination],
    queryFn: () =>
      plantSpeciesClient.findAll({
        filters: [{ field: 'difficulty', operator: 'eq', value: difficulty }],
        pagination,
      }),
    enabled: enabled && !!difficulty,
  });

  return {
    plantSpecies: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
