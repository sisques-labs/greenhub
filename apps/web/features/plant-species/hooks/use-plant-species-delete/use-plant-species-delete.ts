import { plantSpeciesClient } from '@/features/plant-species/api/client/plant-species.client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook for deleting a plant species using TanStack Query
 */
export function usePlantSpeciesDelete() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (id: string) => plantSpeciesClient.delete({ id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['plant-species'] });
		},
	});

	const handleDelete = async (
		id: string,
		onSuccess?: () => void,
		onError?: (error: Error) => void,
	) => {
		try {
			const result = await mutation.mutateAsync(id);

			if (result?.success) {
				onSuccess?.();
			}
		} catch (error) {
			const deleteError =
				error instanceof Error
					? error
					: new Error('Plant species delete failed');
			onError?.(deleteError);
		}
	};

	return {
		handleDelete,
		isLoading: mutation.isPending,
		error: mutation.error,
		isSuccess: mutation.isSuccess,
	};
}
