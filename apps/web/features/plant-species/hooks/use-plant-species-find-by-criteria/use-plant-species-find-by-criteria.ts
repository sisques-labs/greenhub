import { plantSpeciesClient } from '@/features/plant-species/api/client/plant-species.client';
import type { PlantSpeciesFindByCriteriaInput } from '@/features/plant-species/api/types/plant-species-request.types';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook for fetching plant species list with optional criteria using TanStack Query
 */
export function usePlantSpeciesFindByCriteria(
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
