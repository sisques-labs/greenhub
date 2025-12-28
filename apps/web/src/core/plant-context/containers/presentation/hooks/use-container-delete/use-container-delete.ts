import type { DeleteContainerInput } from '@repo/sdk';
import { useContainers } from '@repo/sdk';

/**
 * Hook that provides container delete functionality
 * Uses SDK directly since backend handles all validation
 */
export function useContainerDelete() {
  const { delete: deleteContainer } = useContainers();

  const handleDelete = async (
    id: string,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    try {
      const input: DeleteContainerInput = { id };

      const result = await deleteContainer.mutate(input);

      if (result?.success) {
        onSuccess?.();
      }
    } catch (error) {
      const deleteError =
        error instanceof Error ? error : new Error('Container delete failed');
      onError?.(deleteError);
    }
  };

  return {
    handleDelete,
    isLoading: deleteContainer.loading,
    error: deleteContainer.error,
  };
}
