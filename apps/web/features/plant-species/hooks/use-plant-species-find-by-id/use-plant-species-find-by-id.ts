import { plantSpeciesClient } from '@/features/plant-species/api/client/plant-species.client';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook for fetching a single plant species by ID using TanStack Query
 */
export function usePlantSpeciesFindById(
	id: string,
	options?: { enabled?: boolean },
) {
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
