import type { PlantCreateFormValues } from '@/core/plant-context/presentation/dtos/schemas/plant-create/plant-create.schema';
import type { PlantAddInput } from '@repo/sdk';
import { useGrowingUnits } from '@repo/sdk';

/**
 * Hook that provides plant create functionality
 * Uses SDK directly since backend handles all validation
 * Uses plantAdd from growingUnits since plants are added to growing units
 */
export function usePlantAdd() {
  const { plantAdd } = useGrowingUnits();

  const handleCreate = async (
    values: PlantCreateFormValues,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    try {
      const input: PlantAddInput = {
        name: values.name,
        species: values.species,
        plantedDate: values.plantedDate,
        notes: values.notes,
        status: values.status,
        growingUnitId: values.growingUnitId,
      };

      const result = await plantAdd.mutate(input);

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
    isLoading: plantAdd.loading,
    error: plantAdd.error,
  };
}
