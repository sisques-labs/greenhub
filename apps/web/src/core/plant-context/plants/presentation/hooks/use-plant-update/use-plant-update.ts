import type { UpdatePlantInput } from '@repo/sdk';
import { usePlants } from '@repo/sdk';
import type { PlantUpdateFormValues } from '@/core/plant-context/plants/presentation/dtos/schemas/plant-update/plant-update.schema';

/**
 * Hook that provides plant update functionality
 * Uses SDK directly since backend handles all validation
 */
export function usePlantUpdate() {
  const { update } = usePlants();

  const handleUpdate = async (
    values: PlantUpdateFormValues,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    try {
      const input: UpdatePlantInput = {
        id: values.id,
        containerId: values.containerId,
        name: values.name,
        species: values.species,
        plantedDate: values.plantedDate || null,
        notes: values.notes || null,
        status: values.status,
      };

      const result = await update.mutate(input);

      if (result?.success) {
        onSuccess?.();
      }
    } catch (error) {
      const updateError =
        error instanceof Error ? error : new Error('Plant update failed');
      onError?.(updateError);
    }
  };

  return {
    handleUpdate,
    isLoading: update.loading,
    error: update.error,
  };
}
