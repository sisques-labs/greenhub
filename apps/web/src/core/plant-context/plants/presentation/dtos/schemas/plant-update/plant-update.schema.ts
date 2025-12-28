import { z } from 'zod';

/**
 * Schema factory for plant update form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for plant update form validation
 */
export function createPlantUpdateSchema(translations: (key: string) => string) {
  return z.object({
    id: z.string().min(1, translations('plant.validation.id.required')),
    containerId: z.string().optional(),
    name: z.string().optional(),
    species: z.string().optional(),
    plantedDate: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    status: z
      .enum(['PLANTED', 'GROWING', 'HARVESTED', 'DEAD', 'ARCHIVED'], {
        errorMap: () => ({
          message: translations('plant.validation.status.invalid'),
        }),
      })
      .optional(),
  });
}

export type PlantUpdateFormValues = z.infer<
  ReturnType<typeof createPlantUpdateSchema>
>;
