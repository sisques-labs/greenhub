import { useMutation, useQueryClient } from '@tanstack/react-query';
import { plantsApiClient } from '../../api/plants-api.client';
import type { PlantCreateInput } from '../../api/types';

/**
 * Hook for creating a plant using TanStack Query
 * Replaces SDK's useGrowingUnits().plantAdd with API client
 */
export function usePlantAdd() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: PlantCreateInput) => plantsApiClient.create(input),
    onSuccess: () => {
      // Invalidate plants queries to refetch with new data
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      // Also invalidate growing units queries since plants belong to growing units
      queryClient.invalidateQueries({ queryKey: ['growing-units'] });
    },
  });

  const handleCreate = async (
    input: PlantCreateInput,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    try {
      const result = await mutation.mutateAsync(input);

      if (result?.success) {
        onSuccess?.();
      }
    } catch (error) {
      const createError =
        error instanceof Error ? error : new Error('Plant create failed');
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
