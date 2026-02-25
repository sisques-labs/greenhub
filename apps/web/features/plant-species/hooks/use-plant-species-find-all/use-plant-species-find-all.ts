import { useQuery } from '@tanstack/react-query';
import { plantSpeciesClient } from '../../api/client/plant-species.client';
import type { PlantSpeciesFindByCriteriaInput } from '../../api/types/plant-species-request.types';

/**
 * Hook for fetching plant species list with optional criteria using TanStack Query
 */
export function usePlantSpeciesFindAll(
  input?: PlantSpeciesFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: ['plant-species', 'list', input],
    queryFn: () => plantSpeciesClient.findAll(input),
    enabled,
  });

  return {
    plantSpecies: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
