import type { CreateContainerInput } from '@repo/sdk';
import { useContainers } from '@repo/sdk';
import type { ContainerCreateFormValues } from '@/core/plant-context/containers/presentation/dtos/schemas/container-create/container-create.schema';

/**
 * Hook that provides container create functionality
 * Uses SDK directly since backend handles all validation
 */
export function useContainerCreate() {
  const { create } = useContainers();

  const handleCreate = async (
    values: ContainerCreateFormValues,
    onSuccess?: (containerId: string) => void,
    onError?: (error: Error) => void,
  ) => {
    try {
      const input: CreateContainerInput = {
        name: values.name,
        type: values.type,
      };

      const result = await create.mutate(input);

      if (result?.success && result?.id) {
        onSuccess?.(result.id);
      }
    } catch (error) {
      const createError =
        error instanceof Error ? error : new Error('Container create failed');
      onError?.(createError);
    }
  };

  return {
    handleCreate,
    isLoading: create.loading,
    error: create.error,
  };
}
