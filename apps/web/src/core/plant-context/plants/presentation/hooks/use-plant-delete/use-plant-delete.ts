import type { DeletePlantInput } from '@repo/sdk';
import { usePlants } from '@repo/sdk';

/**
 * Hook that provides plant delete functionality
 * Uses SDK directly since backend handles all validation
 */
export function usePlantDelete() {
  const { delete: deletePlant } = usePlants();

  const handleDelete = async (
    id: string,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    try {
      const input: DeletePlantInput = { id };

      const result = await deletePlant.mutate(input);

      if (result?.success) {
        onSuccess?.();
      }
    } catch (error) {
      const deleteError =
        error instanceof Error ? error : new Error('Plant delete failed');
      onError?.(deleteError);
    }
  };

  return {
    handleDelete,
    isLoading: deletePlant.loading,
    error: deletePlant.error,
  };
}
