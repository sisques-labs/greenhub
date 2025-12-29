import { z } from 'zod';

/**
 * Schema factory for plant transplant form validation
 * Following DDD principles, this schema is isolated in its own module
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for plant transplant form validation
 */
export function createPlantTransplantSchema(
  translations: (key: string) => string,
) {
  return z.object({
    plantId: z
      .string()
      .min(1, translations('plant.validation.plantId.required')),
    sourceGrowingUnitId: z
      .string()
      .min(1, translations('plant.validation.sourceGrowingUnitId.required')),
    targetGrowingUnitId: z
      .string()
      .min(1, translations('plant.validation.targetGrowingUnitId.required')),
  });
}

export type PlantTransplantFormValues = z.infer<
  ReturnType<typeof createPlantTransplantSchema>
>;
