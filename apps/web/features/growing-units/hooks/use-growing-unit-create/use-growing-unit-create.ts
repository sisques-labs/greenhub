import { useMutation, useQueryClient } from '@tanstack/react-query';
import { growingUnitsApiClient } from '../../api/growing-units-api.client';
import type { CreateGrowingUnitInput } from '../../api/types';

/**
 * Hook for creating a growing unit using TanStack Query
 * Replaces SDK's useGrowingUnits().create with API client
 */
export function useGrowingUnitCreate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateGrowingUnitInput) =>
      growingUnitsApiClient.create(input),
    onSuccess: () => {
      // Invalidate growing units queries to refetch with new data
      queryClient.invalidateQueries({ queryKey: ['growing-units'] });
    },
  });

  const handleCreate = async (
    input: CreateGrowingUnitInput,
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
        error instanceof Error
          ? error
          : new Error('Growing unit create failed');
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
