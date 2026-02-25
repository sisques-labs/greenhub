import { useMutation, useQueryClient } from '@tanstack/react-query';
import { plantSpeciesClient } from '../../api/client/plant-species.client';
import type { PlantSpeciesUpdateInput } from '../../api/types/plant-species-request.types';

/**
 * Hook for updating a plant species using TanStack Query
 */
export function usePlantSpeciesUpdate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, ...input }: PlantSpeciesUpdateInput) =>
      plantSpeciesClient.update(id, input),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['plant-species', 'detail', variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ['plant-species', 'list'] });
    },
  });

  const handleUpdate = async (
    input: PlantSpeciesUpdateInput,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    try {
      const result = await mutation.mutateAsync(input);

      if (result?.success) {
        onSuccess?.();
      }
    } catch (error) {
      const updateError =
        error instanceof Error ? error : new Error('Plant species update failed');
      onError?.(updateError);
    }
  };

  return {
    handleUpdate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
