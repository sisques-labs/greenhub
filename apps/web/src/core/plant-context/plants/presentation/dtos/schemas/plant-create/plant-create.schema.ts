import { PLANT_STATUS, type PlantStatus } from '@repo/sdk';
import { z } from 'zod';

/**
 * Schema factory for plant create form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for plant create form validation
 */
export function createPlantCreateSchema(translations: (key: string) => string) {
  return z.object({
    containerId: z
      .string()
      .min(1, translations('plant.validation.containerId.required')),
    name: z.string().min(1, translations('plant.validation.name.required')),
    species: z
      .string()
      .min(1, translations('plant.validation.species.required')),
    plantedDate: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    status: z.enum(
      [
        PLANT_STATUS.PLANTED,
        PLANT_STATUS.GROWING,
        PLANT_STATUS.HARVESTED,
        PLANT_STATUS.DEAD,
        PLANT_STATUS.ARCHIVED,
      ] as const,
      {
        message: translations('plant.validation.status.invalid'),
      },
    ),
  });
}

export type PlantCreateFormValues = z.infer<
  ReturnType<typeof createPlantCreateSchema>
>;
