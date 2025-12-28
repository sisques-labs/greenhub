import type { CreatePlantInput } from '@repo/sdk';
import { usePlants } from '@repo/sdk';
import type { PlantCreateFormValues } from '@/core/plant-context/plants/presentation/dtos/schemas/plant-create/plant-create.schema';

/**
 * Hook that provides plant create functionality
 * Uses SDK directly since backend handles all validation
 */
export function usePlantCreate() {
  const { create } = usePlants();

  const handleCreate = async (
    values: PlantCreateFormValues,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    try {
      const input: CreatePlantInput = {
        containerId: values.containerId,
        name: values.name,
        species: values.species,
        plantedDate: values.plantedDate || null,
        notes: values.notes || null,
        status: values.status,
      };

      const result = await create.mutate(input);

      if (result?.success) {
        onSuccess?.();
      }
    } catch (error) {
      const createError =
        error instanceof Error ? error : new Error('Plant create failed');
      onError?.(createError);
    }
  };

  return {
    handleCreate,
    isLoading: create.loading,
    error: create.error,
  };
}
