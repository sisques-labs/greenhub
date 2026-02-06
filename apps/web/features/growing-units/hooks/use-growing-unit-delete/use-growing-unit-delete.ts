import { useMutation, useQueryClient } from '@tanstack/react-query';
import { growingUnitsApiClient } from '../../api/growing-units-api.client';

/**
 * Hook for deleting a growing unit using TanStack Query
 * Replaces SDK's useGrowingUnits().delete with API client
 */
export function useGrowingUnitDelete() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => growingUnitsApiClient.delete(id),
    onSuccess: () => {
      // Invalidate all growing units queries
      queryClient.invalidateQueries({ queryKey: ['growing-units'] });
    },
  });

  const handleDelete = async (
    id: string,
    onSuccess?: () => void,
    onError?: (error: Error) => void
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
          : new Error('Growing unit delete failed');
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
