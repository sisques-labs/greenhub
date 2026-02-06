import { useMutation, useQueryClient } from '@tanstack/react-query';
import { growingUnitsApiClient } from '../../api/growing-units-api.client';
import type { UpdateGrowingUnitInput } from '../../api/types';

/**
 * Hook for updating a growing unit using TanStack Query
 * Replaces SDK's useGrowingUnits().update with API client
 */
export function useGrowingUnitUpdate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, ...input }: UpdateGrowingUnitInput) =>
      growingUnitsApiClient.update(id, input),
    onSuccess: (data, variables) => {
      // Invalidate specific growing unit query
      queryClient.invalidateQueries({
        queryKey: ['growing-units', 'detail', variables.id],
      });
      // Also invalidate growing units list
      queryClient.invalidateQueries({ queryKey: ['growing-units', 'list'] });
    },
  });

  const handleUpdate = async (
    input: UpdateGrowingUnitInput,
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
        error instanceof Error
          ? error
          : new Error('Growing unit update failed');
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
