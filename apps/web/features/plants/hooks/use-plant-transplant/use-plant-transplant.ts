import { useMutation, useQueryClient } from '@tanstack/react-query';
import { plantsApiClient } from '../../api/plants-api.client';
import type { PlantTransplantInput } from '../../api/types';

/**
 * Hook for transplanting a plant to a different growing unit using TanStack Query
 * Replaces SDK's usePlants().transplant with API client
 */
export function usePlantTransplant() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ plantId, ...input }: PlantTransplantInput) =>
      plantsApiClient.transplant(plantId, input),
    onSuccess: (data, variables) => {
      // Invalidate specific plant query
      queryClient.invalidateQueries({
        queryKey: ['plants', 'detail', variables.plantId],
      });
      // Invalidate plants list
      queryClient.invalidateQueries({ queryKey: ['plants', 'list'] });
      // Invalidate both source and target growing units
      queryClient.invalidateQueries({
        queryKey: ['growing-units', 'detail', variables.sourceGrowingUnitId],
      });
      queryClient.invalidateQueries({
        queryKey: ['growing-units', 'detail', variables.targetGrowingUnitId],
      });
    },
  });

  const handleTransplant = async (
    input: PlantTransplantInput,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    try {
      const result = await mutation.mutateAsync(input);

      if (result?.success) {
        onSuccess?.();
      }
    } catch (error) {
      const transplantError =
        error instanceof Error ? error : new Error('Plant transplant failed');
      onError?.(transplantError);
    }
  };

  return {
    handleTransplant,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
