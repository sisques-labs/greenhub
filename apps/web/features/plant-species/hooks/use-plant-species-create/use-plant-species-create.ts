import { plantSpeciesClient } from '@/features/plant-species/api/client/plant-species.client';
import type { PlantSpeciesCreateInput } from '@/features/plant-species/api/types/plant-species-request.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook for creating a plant species using TanStack Query
 */
export function usePlantSpeciesCreate() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (input: PlantSpeciesCreateInput) =>
			plantSpeciesClient.create(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['plant-species'] });
		},
	});

	const handleCreate = async (
		input: PlantSpeciesCreateInput,
		onSuccess?: () => void,
		onError?: (error: Error) => void,
	) => {
		try {
			const result = await mutation.mutateAsync(input);

			if (result?.success) {
				onSuccess?.();
			}
		} catch (error) {
			const createError =
				error instanceof Error
					? error
					: new Error('Plant species create failed');
			onError?.(createError);
		}
	};

	return {
		handleCreate,
		isLoading: mutation.isPending,
		error: mutation.error,
		isSuccess: mutation.isSuccess,
	};
}
