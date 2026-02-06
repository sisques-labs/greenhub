import { useMutation, useQueryClient } from '@tanstack/react-query';
import { plantsApiClient } from '../../api/plants-api.client';
import type { PlantUpdateInput } from '../../api/types';

/**
 * Hook for updating a plant using TanStack Query
 * Replaces SDK's usePlants().update with API client
 */
export function usePlantUpdate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, ...input }: PlantUpdateInput) =>
      plantsApiClient.update(id, input),
    onSuccess: (data, variables) => {
      // Invalidate specific plant query
      queryClient.invalidateQueries({
        queryKey: ['plants', 'detail', variables.id],
      });
      // Also invalidate plants list
      queryClient.invalidateQueries({ queryKey: ['plants', 'list'] });
    },
  });

  const handleUpdate = async (
    input: PlantUpdateInput,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    try {
      const result = await mutation.mutateAsync(input);

      if (result?.success) {
        onSuccess?.();
      }
    } catch (error) {
      const updateError =
        error instanceof Error ? error : new Error('Plant update failed');
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
