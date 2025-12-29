import type { PlantTransplantInput } from '@repo/sdk';
import { usePlants } from '@repo/sdk';
import type { PlantTransplantFormValues } from '@/core/plant-context/presentation/dtos/schemas/plant-transplant/plant-transplant.schema';

/**
 * Hook that provides plant transplant functionality
 * Uses SDK directly since backend handles all validation
 */
export function usePlantTransplant() {
  const { transplant } = usePlants();

  const handleTransplant = async (
    values: PlantTransplantFormValues,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    try {
      const input: PlantTransplantInput = {
        plantId: values.plantId,
        sourceGrowingUnitId: values.sourceGrowingUnitId,
        targetGrowingUnitId: values.targetGrowingUnitId,
      };

      const result = await transplant.mutate(input);

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
    isLoading: transplant.loading,
    error: transplant.error,
  };
}
