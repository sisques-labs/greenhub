import type { UpdateContainerInput } from '@repo/sdk';
import { useContainers } from '@repo/sdk';
import type { ContainerUpdateFormValues } from '@/core/plant-context/containers/presentation/dtos/schemas/container-update/container-update.schema';

/**
 * Hook that provides container update functionality
 * Uses SDK directly since backend handles all validation
 */
export function useContainerUpdate() {
  const { update } = useContainers();

  const handleUpdate = async (
    values: ContainerUpdateFormValues,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    try {
      const input: UpdateContainerInput = {
        id: values.id,
        name: values.name,
        type: values.type,
      };

      const result = await update.mutate(input);

      if (result?.success) {
        onSuccess?.();
      }
    } catch (error) {
      const updateError =
        error instanceof Error ? error : new Error('Container update failed');
      onError?.(updateError);
    }
  };

  return {
    handleUpdate,
    isLoading: update.loading,
    error: update.error,
  };
}
