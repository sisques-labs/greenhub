import type { ChangePlantStatusInput, PlantStatus } from '@repo/sdk';
import { usePlants } from '@repo/sdk';

/**
 * Hook that provides plant change status functionality
 * Uses SDK directly since backend handles all validation
 */
export function usePlantChangeStatus() {
  const { changeStatus } = usePlants();

  const handleChangeStatus = async (
    id: string,
    status: PlantStatus,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    try {
      const input: ChangePlantStatusInput = { id, status };

      const result = await changeStatus.mutate(input);

      if (result?.success) {
        onSuccess?.();
      }
    } catch (error) {
      const changeStatusError =
        error instanceof Error
          ? error
          : new Error('Plant change status failed');
      onError?.(changeStatusError);
    }
  };

  return {
    handleChangeStatus,
    isLoading: changeStatus.loading,
    error: changeStatus.error,
  };
}
